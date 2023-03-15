const convertPhotoListForFrontEnd = (photoObjList) => {
  //determine the image type and send this back to the front end
  function getImageType(buffer) {
    if (buffer[0] === 0xff && buffer[1] === 0xd8) {
      return "jpeg";
    } else if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    ) {
      return "png";
    } else {
      return null;
    }
  }

  //   const photoObjListWithTypeAndBase64Data = photoObjList.map(
  //     (unconvertedPhotoObj) => {
  //       const convertedPhotoObj = {
  //         type: getImageType(unconvertedPhotoObj.listingPhoto),
  //         data: Buffer.from(unconvertedPhotoObj.listingPhoto).toString("base64"),
  //       };
  //       return convertedPhotoObj;
  //     }
  //   );

  //   console.log(photoObjListWithTypeAndBase64Data);

  //   return photoObjListWithTypeAndBase64Data;
  // };

  const photoObjListWithDataUrls = photoObjList.map((unconvertedPhotoObj) => {
    const imageType = getImageType(unconvertedPhotoObj.listingPhoto);
    const base64Data = Buffer.from(unconvertedPhotoObj.listingPhoto).toString(
      "base64"
    );
    const dataUrl = `data:image/${imageType};base64,${base64Data}`;

    return {
      type: imageType,
      dataUrl: dataUrl,
    };
  });

  console.log(photoObjListWithDataUrls);

  return photoObjListWithDataUrls;
};

module.exports = convertPhotoListForFrontEnd;
