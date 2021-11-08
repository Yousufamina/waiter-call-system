const fs = require('fs');
const helper = {

    uploadImage (request , fileName , callBack){

        let fileImg='';
        if(request.files) {
            var image = false;
            var file = request.files;
            for (var k in file) {
                if (file[k].fieldname == fileName) {
                    image = file[k];
                    break;
                }
            }
            if (image) {
                let fileName = new Date().getTime() + "." + image.originalname.split('.').pop();
                fileImg = '/images/' + image.filename +fileName;
                console.log(image.path+fileName);
                console.log("fileImg");
                console.log(fileImg);
                fs.rename(image.path, image.path + fileName, function (err) {
                    if (err) {
                        console.log(err);
                        callBack(false);
                    }
                    else {
                        callBack(fileImg)
                    }
                });
            }
            else{
                callBack(false);
            }
        }
    }
}

module.exports = helper;
