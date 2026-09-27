// Demo controller — commercial quote example
(function(){
  var stateOrder = ['idle','1','2','3','4'];
  var currentState = 'idle';
  var timer = null;
  var isPaused = false;

  var stateEls = {
    idle:  document.getElementById('demoState'),
    s1:    document.getElementById('demoState1'),
    s2:    document.getElementById('demoState2'),
    s3:    document.getElementById('demoState3'),
    s4:    document.getElementById('demoState4')
  };

  var progressEl = document.getElementById('demoProgress');
  var runBtn = document.getElementById('demoRun');
  var pauseBtn = document.getElementById('demoPause');
  var replayBtn = document.getElementById('demoReplay');
  var exceptionBtn = document.getElementById('demoException');

  var totalSteps = stateOrder.length - 1; // 4 transitions (idle→1→2→3→4)
  var stepDuration = 1400; // ms per step — readable, not implying real speed

  function showState(name){
    Object.keys(stateEls).forEach(function(key){
      if(stateEls[key]) stateEls[key].style.display = (key === name || (key === 'idle' && name === 'idle')) ? 'block' : 'none';
    });
    currentState = name;

    // Update progress text
    var idx = stateOrder.indexOf(name);
    if(name === 'idle'){
      progressEl.textContent = 'Press play to begin';
    } else if(name === '4'){
      progressEl.textContent = 'Complete · The enquiry has a next step. The record is current.';
    } else {
      var labels = {1:'Enquiry received',2:'Information requested',3:'Record updated',4:'Follow-through complete'};
      progressEl.textContent = labels[name] || '';
    }

    // Update button states
    runBtn.style.display = (name === 'idle' || name === '4') ? 'inline-flex' : 'none';
    pauseBtn.style.display = (name !== 'idle' && name !== '4') ? 'inline-flex' : 'none';
    replayBtn.style.display = (name === '4') ? 'inline-flex' : 'none';
  }

  function advance(){
    var idx = stateOrder.indexOf(currentState);
    if(idx >= totalSteps) return; // already at end
    showState(stateOrder[idx + 1]);
  }

  function startSequence(){
    if(timer) return;
    showState('1');
    var step = 1;
    timer = setInterval(function(){
      step++;
      if(step > totalSteps){
        clearInterval(timer);
        timer = null;
        return;
      }
      showState(stateOrder[step]);
    }, stepDuration);
  }

  function pauseSequence(){
    if(timer){
      clearInterval(timer);
      timer = null;
      isPaused = true;
      pauseBtn.textContent = 'Resume';
    } else if(isPaused && currentState !== 'idle' && currentState !== '4'){
      // Resume
      isPaused = false;
      pauseBtn.textContent = 'Pause';
      var step = stateOrder.indexOf(currentState);
      timer = setInterval(function(){
        step++;
        if(step > totalSteps){
          clearInterval(timer);
          timer = null;
          return;
        }
        showState(stateOrder[step]);
      }, stepDuration);
    }
  }

  function resetSequence(){
    if(timer){ clearInterval(timer); timer = null; }
    isPaused = false;
    pauseBtn.textContent = 'Pause';
    showState('idle');
  }

  function replaySequence(){
    resetSequence();
    // Small delay before starting so the reset is visible
    setTimeout(startSequence, 200);
  }

  function showException(){
    resetSequence();
    // Jump to state 3 (record updated) which represents the decision point
    // Then show the approval context
    showState('3');
    progressEl.textContent = 'Approval required · Discouts above 10% require your approval';
    runBtn.style.display = 'none';
    pauseBtn.style.display = 'none';
    replayBtn.style.display = 'inline-flex';
    replayBtn.textContent = 'Return to demo';
  }

  // Event listeners
  runBtn.addEventListener('click', startSequence);
  pauseBtn.addEventListener('click', pauseSequence);
  replayBtn.addEventListener('click', function(){
    if(replayBtn.textContent === 'Return to demo'){
      resetSequence();
      replayBtn.textContent = 'Replay';
    } else {
      replaySequence();
    }
  });
  exceptionBtn.addEventListener('click', showException);

  // Initial state
  showState('idle');
})();
