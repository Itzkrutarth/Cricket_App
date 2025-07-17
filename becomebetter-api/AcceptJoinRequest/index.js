const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
  const endpoint = process.env.COSMOS_DB_ENDPOINT;
  const key = process.env.COSMOS_DB_KEY;
  const client = new CosmosClient({ endpoint, key });

  const db = client.database("becomebetter");
  const requestContainer = db.container("requests");
  const userContainer = db.container("users");

  const { requestId } = req.body;

  if (!requestId) {
    context.res = { status: 400, body: "Missing requestId" };
    return;
  }

  try {
    // Read the request document using correct partition key
    const { resource: request } = await requestContainer
      .item(requestId, requestId.split("-")[1]) // coachId is second part in ID
      .read();

    if (!request) {
      context.res = { status: 404, body: "Request not found" };
      return;
    }

    request.status = "accepted";
    await requestContainer.item(requestId, request.coachId).replace(request);

    // Update student
    const { resource: student } = await userContainer.item(request.studentId, request.studentId).read();
    student.coaches = Array.from(new Set([...(student.coaches || []), request.coachId]));
    await userContainer.item(student.id, student.id).replace(student);

    // Update coach
    const { resource: coach } = await userContainer.item(request.coachId, request.coachId).read();
    coach.students = Array.from(new Set([...(coach.students || []), request.studentId]));
    await userContainer.item(coach.id, coach.id).replace(coach);

    context.res = { status: 200, body: { message: "Request accepted" } };
  } catch (err) {
    context.log("❌ Error accepting request:", err.message);
    context.res = { status: 500, body: `Internal Server Error: ${err.message}` };
  }
};
