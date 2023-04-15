var wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#828282',
    progressColor: '#333333',
    barWidth: 1,
    barHeight: 1, // the height of the wave
    barGap: null,
    height:100,
    plugins: [
        WaveSurfer.cursor.create({
            showTime: true,
            opacity: 0.8,
            hideOnBlur: true,
            width:'1px',
            customShowTimeStyle: {
                'background-color': '#333333',
                color: '#828282',
                hideOnBlur:true,
                padding: '2px',
                'font-size': '10px'
            }
        })
    ]
});
wavesurfer.load('/assets/eroica1.mp3');
var btn = document.getElementById("but")
btn.onclick = function() {
    console.log("clicked")
    btn.classList.toggle("paused");
    console.log(wavesurfer);
    wavesurfer.playPause();
    return false;
};