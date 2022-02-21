function importarScript(nombre) {
    var s = document.createElement("script");
    s.src = nombre;
    document.querySelector("head").appendChild(s);
}
importarScript("face-api.min.js")



const video= document.getElementById('video');//llamo a la etiqueta video del index.html

function startVideo(){
    navigator.getUserMedia(//navigator.mediaDevices.getUserMedia
        {video: {} },
        stream => video.srcObject = stream,
        err => console.log(err)
    )
}
startVideo()

Promise.all([
    
    faceapi.nets.tinyFaceDetector.loadFromUri("https://drive.google.com/drive/folders/1nWolNW0f7g_pheA0TQZUWCFg-u0sQrUj?usp=sharing"),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    faceapi.nets.ageGenderNet.loadFromUri('/models'),
]).then(startVideo);


video.addEventListener('play', () => { //caputar el evento play sobre el objeto video
 const canvas = faceapi.createCanvasFromMedia(video);
 document.body.append(canvas);
 const displaySize = {width: video.width, height: video.height};
 faceapi.matchDimensions(canvas,displaySize);
 setInterval (async ()=>{
     const detections = await faceapi.detectAllFaces(video, new 
        faceapi.tinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
     console.log(detections)

     const resizeDetections = faceapi.resizeResults(detections, displaySize);

     canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

     faceapi.draw.drawDetections(canvas, resizeDetections);
     faceapi.draw.drawFaceLandmarks(canvas, resizeDetections);
     faceapi.draw.drawFaceExpressions(canvas, resizeDetections);
 }, 100)
});