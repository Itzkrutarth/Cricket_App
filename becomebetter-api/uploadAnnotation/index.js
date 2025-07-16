const {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  SASProtocol,
} = require("@azure/storage-blob");
const { CosmosClient } = require("@azure/cosmos");

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const COSMOS_CONNECTION_STRING = process.env.COSMOS_CONNECTION_STRING;
const AZURE_STORAGE_ACCOUNT_NAME = "becomebetterstorage";

// 🔐 Extract Account Key from connection string
const extractAccountKey = (connString) => {
  const parts = connString.split(";");
  return parts.find((p) => p.startsWith("AccountKey="))?.split("=")[1];
};
const AZURE_STORAGE_ACCOUNT_KEY = extractAccountKey(AZURE_STORAGE_CONNECTION_STRING);

module.exports = async function (context, req) {
  const {
    annotations,
    videoId,
    recordedFor,
    uploadedBy,
    assignedCoachId,
    title,
    description,
    videoUrl,
  } = req.body;

  if (!annotations || !videoId || !recordedFor || !uploadedBy || !assignedCoachId) {
    context.res = {
      status: 400,
      body: "Missing required fields (annotations, videoId, recordedFor, uploadedBy, assignedCoachId)",
    };
    return;
  }

  try {
    // 🔵 Upload to Blob Storage
    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient("annotations");
    const filename = `${videoId}-annotations.json`;
    const blockBlobClient = containerClient.getBlockBlobClient(filename);

    const annotationBuffer = Buffer.from(JSON.stringify(annotations));
    context.log("📄 Annotation content:", annotationBuffer.toString());

    await blockBlobClient.uploadData(annotationBuffer, {
      blobHTTPHeaders: { blobContentType: "application/json" },
    });

    context.log("✅ Blob uploaded successfully");

    // 🛡️ Generate SAS URL
    const sharedKeyCredential = new StorageSharedKeyCredential(
      AZURE_STORAGE_ACCOUNT_NAME,
      AZURE_STORAGE_ACCOUNT_KEY
    );

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName: "annotations",
        blobName: filename,
        permissions: BlobSASPermissions.parse("r"),
        startsOn: new Date(),
        expiresOn: new Date(new Date().valueOf() + 3600 * 1000), // valid for 1 hour
        protocol: SASProtocol.Https,
      },
      sharedKeyCredential
    ).toString();

    const annotationUrl = `${blockBlobClient.url}?${sasToken}`;

    // 🟣 Save metadata to Cosmos DB
    const cosmosClient = new CosmosClient(COSMOS_CONNECTION_STRING);
    const db = cosmosClient.database("becomebetter");
    const container = db.container("annotations");

    const newItem = {
      id: videoId,
      videoId,
      annotationUrl,
      recordedFor,
      uploadedBy,
      assignedCoachId,
      uploadedAt: new Date().toISOString(),
      title,
      description,
      videoUrl: videoUrl || null,
    };

    await container.items.create(newItem, { partitionKey: uploadedBy });

    context.res = {
      status: 200,
      body: {
        message: "Annotations uploaded successfully",
        annotationUrl,
        annotationId: videoId,
      },
    };
  } catch (error) {
    context.log.error("❌ Upload failed:", error);
    context.res = {
      status: 500,
      body: "Upload failed: " + error.message,
    };
  }
};
