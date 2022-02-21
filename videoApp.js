

const video= document.getElementById('video');//llamo a la etiqueta video del index.html

Promise.all([
    
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    faceapi.nets.ageGenderNet.loadFromUri('/models')
]).then(startVideo);

function startVideo(){
    
    navigator.getUserMedia(// navigator.mediaDevices.getUserMedia
        {video: {} },
        stream => video.srcObject = stream,
        err => console.log(err)
    )
}
startVideo()



video.addEventListener('play', () => { //capturar el evento play sobre el objeto video
 const canvas = faceapi.createCanvasFromMedia(video);
 document.body.append(canvas);
 const displaySize = {width: video.width, height: video.height};
 faceapi.matchDimensions(canvas,displaySize);
 setInterval (async ()=>{
     const detections = await faceapi.detectAllFaces(video, new 
        faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
     console.log(detections)

     const resizeDetections = faceapi.resizeResults(detections, displaySize);

     canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

     faceapi.draw.drawDetections(canvas, resizeDetections);
     faceapi.draw.drawFaceLandmarks(canvas, resizeDetections);
     faceapi.draw.drawFaceExpressions(canvas, resizeDetections);
 }, 200)
});