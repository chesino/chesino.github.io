//PIP iOS Android
document.getElementById('fileInput').addEventListener('change', async function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const videoElement = document.getElementById('video');
    const canvasElement = document.getElementById('canvas');

    // Reset the elements
    videoElement.hidden = true;

    if (file.type.startsWith('video/')) {
        const url = URL.createObjectURL(file);
        videoElement.src = url;
        videoElement.hidden = false;

        // Wait for video to be ready for playback
        videoElement.onloadedmetadata = async () => {
            try {
                await videoElement.play();
                if (document.pictureInPictureEnabled) {
                    await videoElement.requestPictureInPicture();
                } else {
                    alert("Your browser does not support Picture-in-Picture.");
                }
            } catch (error) {
                console.error('Failed to enter PiP mode:', error);
            }
        };
    } else if (file.type.startsWith('image/')) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = async () => {
            // Set canvas dimensions to image dimensions
            canvasElement.width = img.width;
            canvasElement.height = img.height;
            const ctx = canvasElement.getContext('2d');
            ctx.drawImage(img, 0, 0, img.width, img.height);

            // Create video from canvas
            const stream = canvasElement.captureStream(30); // 30 FPS
            videoElement.srcObject = stream;
            videoElement.hidden = false;

            // Wait for video to be ready for playback
            videoElement.onloadedmetadata = async () => {
                try {
                    await videoElement.play();
                    if (document.pictureInPictureEnabled) {
                        await videoElement.requestPictureInPicture();
                    } else {
                        Fail("Lỗi", "Your browser does not support Picture-in-Picture.");
                    }
                } catch (error) {
                    console.error('Failed to enter PiP mode:', error);
                }
            };
        };
    }
});