const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = "becomebetter";
const containerId = "users";

module.exports = async function (context, req) {
  const coachId = req.body.coachId;
  const studentId = req.body.studentId;

  if (!coachId || !studentId) {
    context.res = {
      status: 400,
      body: "Missing coachId or studentId in request."
    };
    return;
  }

  const client = new CosmosClient({ endpoint, key });
  const container = client.database(databaseId).container(containerId);

  try {
    const { resource: coach } = await container.item(coachId, coachId).read();

    if (!coach) {
      context.res = {
        status: 404,
        body: "Coach not found."
      };
      return;
    }

    const students = coach.students || [];
    if (!students.includes(studentId)) {
      coach.students = [...students, studentId];
      await container.item(coachId, coachId).replace(coach);
    }

    context.res = {
      status: 200,
      body: { message: "Student added to coach successfully", updatedCoach: coach }
    };
  } catch (error) {
    context.log("AddStudentToCoach error:", error.message);
    context.res = {
      status: 500,
      body: "Server error while updating coach document."
    };
  }
};
