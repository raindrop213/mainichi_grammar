/********************************************************************************
  优化版音频处理脚本 (支持动态元素)
********************************************************************************/

// 全局音频控制对象
const syncerSounds = {
  currentTime: null, // 当前播放的音频ID
  elements: {}       // 存储已创建的音频元素
};

// 音频控制器
(function () {
  // 配置项
  const config = {
    buttonClass: "sounds",      // 音频按钮的类名
    audioDir: "",             // 音频文件目录（以 / 结尾）
    stopButtonId: "stop-button-syncer" // 停止按钮ID
  };

  // 使用事件委托处理动态元素
  document.addEventListener('click', function(event) {
    const target = event.target.closest(`.${config.buttonClass}`);
    if (!target) return;

    event.preventDefault();
    handleSoundPlay(target);
  });

  // 停止按钮事件
  document.getElementById(config.stopButtonId)?.addEventListener('click', function(e) {
    e.preventDefault();
    stopCurrentSound();
  });

  // 处理音频播放
  function handleSoundPlay(button) {
    const file = button.dataset.file;
    if (!file) return;

    // 创建或复用音频元素
    if (!syncerSounds.elements[file]) {
      const audio = document.createElement('audio');
      audio.id = file;
      
      // 优先使用 MP3，回退到 WAV
      const ext = audio.canPlayType('audio/mpeg') ? '.mp3' : 
                 audio.canPlayType('audio/wav') ? '.wav' : null;
      
      if (!ext) {
        console.error('浏览器不支持音频格式');
        return;
      }

      audio.src = `${config.audioDir}${file}${ext}`;
      document.body.appendChild(audio);
      syncerSounds.elements[file] = audio;
    }

    // 停止当前音频
    stopCurrentSound();

    // 播放新音频
    syncerSounds.elements[file].play();
    syncerSounds.currentTime = file;
  }

  // 停止当前音频
  function stopCurrentSound() {
    if (syncerSounds.currentTime && syncerSounds.elements[syncerSounds.currentTime]) {
      const audio = syncerSounds.elements[syncerSounds.currentTime];
      audio.pause();
      audio.currentTime = 0;
    }
  }
})();