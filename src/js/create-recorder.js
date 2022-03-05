export default class Recorder {
  constructor({ stream, fileName }) {
    this.stream = stream;
    this.fileName = fileName;

    this.recordedChunks = [];

    this.mediaRecorder = new MediaRecorder(this.stream, { mimeType: 'video/webm' });

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        this.recordedChunks.push(e.data);
      }
    };
  }

  start() {
    this.mediaRecorder.start();
  }

  stop() {
    if (this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();

      setTimeout(() => {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.fileName}.webm`;
        a.click();
        URL.revokeObjectURL(url);
      }, 0);
    }
  }
}
