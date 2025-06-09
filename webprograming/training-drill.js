    const audio = document.getElementById('drill-audio');

    //슬라이더 영역
    const tempoSlider = document.getElementById('tempo');
    const tempoValue = document.getElementById('tempo-value');
    
    //드릴
    const currentDrill = document.getElementById('current-drill');
    
    //타임박스 
    const timerDisplay = document.getElementById('timer');
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');

    const amateurRoutines = [
      '잽', '슥빡', '훅', '투', '어퍼', '바디',
      '잽 잽', '잽 투', '잽 훅', '잽 슥빡', '잽 바디','투 어퍼 투',
      '투 훅', '훅 투', '잽 투 훅', '잽 훅 투', '백 훅 투', '잽 백 투',
      '잽 바디 바디', '잽 백 바디', '원 어퍼 바디','잽 백 잽',
      '잽 잽 투', '잽 잽 슥빡', '아래 위', '위 아래', '원 투 양훅','원투 원투',
      '잽 슥빡 훅', '잽 투 잽', '잽 잽 훅', '슥빡 투', '투 원 투'
    ];

    let drillRunning = false;
    let drillInterval = null;
    let timerInterval = null;
    let remainingTime = 120;

    tempoSlider.addEventListener('input', () => {
      tempoValue.textContent = `${tempoSlider.value} BPM`;
    });

    function getRandomRoutine() {
      return amateurRoutines[Math.floor(Math.random() * amateurRoutines.length)];
    }

    function updateTimerDisplay() {
      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;
      timerDisplay.textContent = `남은 시간: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    async function playDrill(routine, tempo) {
      currentDrill.textContent = `현재 드릴: ${routine}`;
      const audioFile = routine === '원 어퍼 바디' ? '원-어퍼-바디' : routine.replace(/\s+/g, '-');
      audio.src = `sounds/${audioFile}.mp3`;
      await audio.play().catch(e => console.warn("오디오 재생 실패:", e));
    }

    async function startDrill() {
      if (drillRunning) return;
      
      drillRunning = true;
      remainingTime = 120;
      updateTimerDisplay();

      startBtn.disabled = true;
      stopBtn.disabled = false;

      const tempo = parseInt(tempoSlider.value);
      const beatDuration = 60000 / tempo; 
      const cycleDuration = beatDuration * 4; 

      async function runDrill() {
        const routine = getRandomRoutine();
        await playDrill(routine, tempo);
      }

      await runDrill(); // Play first routine immediately
      drillInterval = setInterval(runDrill, cycleDuration);

      timerInterval = setInterval(() => {
        remainingTime--;
        updateTimerDisplay();
        if (remainingTime <= 0) stopDrill();
      }, 1000);
    }

    function stopDrill() {
      drillRunning = false;
      clearInterval(drillInterval);
      clearInterval(timerInterval);
      currentDrill.textContent = '현재 드릴: 없음';
      timerDisplay.textContent = '남은 시간: 2:00';
      audio.pause();
      audio.currentTime = 0;

      startBtn.disabled = false;
      stopBtn.disabled = true;
    }

    startBtn.addEventListener('click', startDrill);
    stopBtn.addEventListener('click', stopDrill);