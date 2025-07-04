const { CosmosClient } = require("@azure/cosmos");
const {
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  SASProtocol,
} = require("@azure/storage-blob");

const COSMOS_CONNECTION_STRING = process.env.COSMOS_CONNECTION_STRING;
const AZURE_STORAGE_ACCOUNT_NAME = "becomebetterstorage";
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = "videos";

function extractAccountKey(connString) {
  const parts = connString.split(";");
  return parts.find((p) => p.startsWith("AccountKey="))?.split("=")[1];
}

const AZURE_STORAGE_ACCOUNT_KEY = extractAccountKey(AZURE_STORAGE_CONNECTION_STRING);

function generateSasUrl(blobName) {
  const sharedKeyCredential = new StorageSharedKeyCredential(
    AZURE_STORAGE_ACCOUNT_NAME,
    AZURE_STORAGE_ACCOUNT_KEY
  );

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName: CONTAINER_NAME,
      blobName,
      permissions: BlobSASPermissions.parse("r"),
      startsOn: new Date(),
      expiresOn: new Date(new Date().valueOf() + 3600 * 1000), // 1 hour
      protocol: SASProtocol.Https,
    },
    sharedKeyCredential
  ).toString();

  return `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${CONTAINER_NAME}/${blobName}?${sasToken}`;
}

module.exports = async function (context, req) {
  const studentEmail = req.query.studentEmail;

  if (!studentEmail) {
    context.res = {
      status: 400,
      body: "Missing required query param: studentEmail",
    };
    return;
  }

  try {
    const cosmosClient = new CosmosClient(COSMOS_CONNECTION_STRING);
    const db = cosmosClient.database("becomebetter");
    const container = db.container("videos");

    const querySpec = {
      query: `
        SELECT * FROM videos v
        WHERE v.recordedFor = @studentEmail
      `,
      parameters: [{ name: "@studentEmail", value: studentEmail }],
    };

    const { resources: videos } = await container.items.query(querySpec).fetchAll();

    const videosWithSas = videos.map((video) => ({
      ...video,
      sasUrl: generateSasUrl(video.id),
    }));

    context.res = {
      status: 200,
      body: videosWithSas,
    };
  } catch (error) {
    context.log.error("Error querying videos for student:", error);
    context.res = {
      status: 500,
      body: "Server error: " + error.message,
    };
  }
};
