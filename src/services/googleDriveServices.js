const fs = require("fs");
const { google } = require("googleapis");

const authenticateGoogle = () => {
  const auth = new google.auth.JWT({
    email: "plobmbo-drive@silver-theme-372212.iam.gserviceaccount.com",
    key: "63f6bc8effdd6e4beeea63136226474c146c51a7",
    keyId:
      "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDHw9K1TzPtX+uk\nIQAZpI2NxKOferHCuuV89DMydnB8ysrOFMA2Kzr9FDQhoPLxR9HH6rDoEnCia+xg\nawfWECOfaeqxUkxpsbF9m78DK/n08huo2taOIZ6MGp11Rgt9NJn7vMoTafzeuwKt\nwPmEe6LiO2Ph11zzE5dv6E5yZqZETRoAfkkK+B0R8Cl51OQFuQWKB4WDZLqrCEEX\nCtI61NGk8eXp/MmOK/16FPmWKnQb8retX/gxJv7i0F2D31d1SkcUbNWtikPORwDj\nFo2+0qnzZYa2FOJ4WVFPhXNUqVreXOXKY6nmQNDTqBIkpcXYfmrgXzfyNPQNMk3a\n0E2G3UnDAgMBAAECggEAWb9ZFXr5bd5nzAvFcz/SFsyu5DHn1gBIpPxDWhsLC43C\nUpbRCiUe8d+XUjpwm0T0czg19XV/ZAFPp7u+QAZtMqwPtE2wpdWe07tatC6YNFtn\nYNO8jAt/oxs7/ZmUBNLSkV4ufU1jPZ/QIsbtcv9m3PPoumiaylxVb4HzaINElK8x\nJadYPGDmldUMgqnoVeAtHLGVJHKPM3jriP4Ud6zBzCNKZzo89FdAI36JylcEB2xr\nCviniiQtqa6nAP0FEFf249cea0h/x1CpuLtoFXa/MQH+SO0hl0fjBL+nZjPjYZPm\ntHWTeKG9ZqrqA3haRJUr/Bk5T2nT3pYrZ+OBo/b92QKBgQD1yR70e2ulUNbvsfMu\nEhbaPaVMS+ssZSfg2ihR8rCV1/ZHUFc6sCri696BoG855m+5LrSc1kcNSAglup/x\ndfzBYMkuJaOGpMixJLzon5NQvuWw3c9wBhcjjm0IM1ldzT6EokCY1LKuzJn9pn8v\nmn+E/fYXBXv6MgGnIGmfpAipKwKBgQDQERgqc2TzeOtDUj+hSVYS7bF41tzhvJZf\nImZj3rMvuG/OLDF6nwBWupWPJShoJuRkO0M64eIHIACt3Lb2RucbOG2BpRk7fOEw\n049A1uaoW9G0pkK0KTg1LsJU7xtzWUgTklJo024pmxCqRYlxT/WUw//Zwg+sA5f1\n902lrbflyQKBgQCXQiq2sq3QkytzX8QUejVuIbn0dlRIgghErH1b0UszLDD4Ok00\nZO4/sIDCrYVF0La49DFaw9P+LHI3Jd8ArmfaakHlEGzOk+KegclwL6RtcM3SRu8+\nNcFPtHsNLOy2eXUcEu5GH7/HK0speqmTFjWcFt631Dw0AUpbG+tkv4JE+QKBgQCi\n6V+UjXmzsS/0LEgqDvPYKkhVJ1cXYMQUhSjKdaqzaKQSOEQdkLWBMuK7jAqRUjJt\n0IEZb5e8oHAnsbOILYfypkIHyq9xBpyD0IJP8HP1yr7txWhhDA04hv4d5oIF1Rg8\nSss/zJxq80EfMQcms8bDzptbczk2JDItoo8ndFeTEQKBgQC+U04MEM9BdyhFhSyY\nB2jIrDhyPoCwQUZ/wbAC4fpbd1N2mIM0fZ9B4WrytBztrthPtqGLE+9Yq0MUFFyE\nEPSUeHdtgGJkMtc8xvUEuj2Gm2jLSxW+J5j6hDB1liVkXF4ahJ+kV2Zhfhp8PH57\nS5wkjiJOj2G6BxxoNVhlTtrGYw==\n-----END PRIVATE KEY-----\n".replace(
        /\\n/g,
        "\n"
      ),
  });
  return auth;
};

async function generatePublicUrl(fileId, drive) {
  try {
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
    const result = await drive.files.get({
      fileId: fileId,
      fields: "webViewLink, webContentLink",
    });
    return result;
  } catch (err) {
    console.log(err);
  }
}

exports.uploadToGoogleDrive = async (file, fileName) => {
  const auth = authenticateGoogle();
  const fileMetadata = {
    name: file.originalname,
    parents: [fileName],
  };

  const media = {
    mimeType: file.mimetype,
    body: fs.createReadStream(file.path),
  };

  const driveService = google.drive({ version: "v3", auth });

  const response = await driveService.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: "id",
  });
  const publicURL = generatePublicUrl(response.data.id, driveService);
  publicURL
    .then((res) => {
      console.log("data ID berhasil dibuat", res);
    })
    .catch((err) => {
      console.log("error, data id gagal dibuat", err);
    });
  return response;
};

exports.deleteFromGoogleDrive = async (imageID) => {
  const auth = authenticateGoogle();
  const driveService = google.drive({ version: "v3", auth });
  const response = await driveService.files.delete({
    fileId: imageID,
  });
  return response;
};
