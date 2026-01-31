(function () {
  const STORAGE_KEY = 'liaofan_learn_progress';
  
  let lessonData = window.LESSON_DATA;
  let lessonContent = window.LESSON_CONTENT;
  let currentModuleIndex = 0;
  let currentQuizIndex = 0;
  let selectedAnswer = null;
  let quizResults = [];
  let progress = loadProgress();

  const elements = {
    progressFill: document.getElementById('progress-fill'),
    progressText: document.getElementById('progress-text'),
    moduleView: document.getElementById('module-view'),
    moduleHeader: document.getElementById('module-header'),
    moduleTitle: document.getElementById('module-title'),
    moduleIndicator: document.getElementById('module-indicator'),
    moduleContent: document.getElementById('module-content'),
    btnSummary: document.getElementById('btn-summary'),
    btnNext: document.getElementById('btn-next'),
    summaryOverlay: document.getElementById('summary-overlay'),
    summaryTitle: document.getElementById('summary-title'),
    summaryPoints: document.getElementById('summary-points'),
    summaryKey: document.getElementById('summary-key'),
    btnCloseSummary: document.getElementById('btn-close-summary'),
    quizView: document.getElementById('quiz-view'),
    quizProgressText: document.getElementById('quiz-progress-text'),
    quizQuestion: document.getElementById('quiz-question'),
    quizOptions: document.getElementById('quiz-options'),
    quizFeedback: document.getElementById('quiz-feedback'),
    btnSubmitAnswer: document.getElementById('btn-submit-answer'),
    btnNextQuestion: document.getElementById('btn-next-question'),
    completeView: document.getElementById('complete-view'),
    completeScore: document.getElementById('complete-score'),
    btnReviewModules: document.getElementById('btn-review-modules')
  };

  function init() {
    // 获取数据
    lessonData = window.LESSON_DATA;
    lessonContent = window.LESSON_CONTENT;
    
    // 简单检查数据是否存在
    if (!lessonData || !lessonData.modules) {
      console.error('课程数据未加载', lessonData);
      return;
    }

    currentModuleIndex = progress.currentModule || 0;
    
    if (progress.completed) {
      showCompleteView();
    } else if (progress.quizStarted) {
      currentQuizIndex = progress.currentQuiz || 0;
      quizResults = progress.quizResults || [];
      showQuizView();
    } else {
      showModuleView();
    }

    bindEvents();
  }

  function bindEvents() {
    if (elements.btnSummary) elements.btnSummary.addEventListener('click', showSummary);
    if (elements.btnNext) elements.btnNext.addEventListener('click', nextModule);
    if (elements.btnCloseSummary) elements.btnCloseSummary.addEventListener('click', hideSummary);
    if (elements.summaryOverlay) {
      elements.summaryOverlay.addEventListener('click', function(e) {
        if (e.target === elements.summaryOverlay) {
          hideSummary();
        }
      });
    }
    if (elements.btnSubmitAnswer) elements.btnSubmitAnswer.addEventListener('click', submitAnswer);
    if (elements.btnNextQuestion) elements.btnNextQuestion.addEventListener('click', nextQuestion);
    if (elements.btnReviewModules) elements.btnReviewModules.addEventListener('click', reviewModules);
    
    // 主题切换
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
      // 加载保存的主题偏好
      loadTheme();
    }
  }

  function loadTheme() {
    const savedTheme = localStorage.getItem('liaofan_theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
      updateThemeButton(true);
    }
  }

  function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    updateThemeButton(isDark);
    localStorage.setItem('liaofan_theme', isDark ? 'dark' : 'light');
  }

  function updateThemeButton(isDark) {
    const icon = document.getElementById('theme-icon');
    const text = document.getElementById('theme-text');
    if (icon && text) {
      if (isDark) {
        icon.textContent = '☀️';
        text.textContent = '亮色模式';
      } else {
        icon.textContent = '🌙';
        text.textContent = '暗色模式';
      }
    }
  }

  function loadProgress() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && lessonData && lessonData.id) {
        const data = JSON.parse(saved);
        return data[lessonData.id] || {};
      }
    } catch (e) {
      console.error('加载进度失败', e);
    }
    return {};
  }

  function saveProgress() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const allData = saved ? JSON.parse(saved) : {};
      allData[lessonData.id] = progress;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
    } catch (e) {
      console.error('保存进度失败', e);
    }
  }

  function updateProgress() {
    const total = lessonData.modules.length;
    const completed = progress.completedModules ? progress.completedModules.length : 0;
    const percentage = (completed / total) * 100;
    
    elements.progressFill.style.width = percentage + '%';
    elements.progressText.textContent = `${completed}/${total} 模块`;
  }

  function showModuleView() {
    elements.moduleView.classList.remove('hidden');
    elements.quizView.classList.add('hidden');
    elements.completeView.classList.add('hidden');
    
    renderModule();
    updateProgress();
  }

  function renderModule() {
    const module = lessonData.modules[currentModuleIndex];
    if (!module) return;

    elements.moduleHeader.style.borderLeftColor = module.color;
    elements.moduleTitle.textContent = `M${currentModuleIndex + 1} · ${module.title}`;
    elements.moduleIndicator.textContent = `${currentModuleIndex + 1}/${lessonData.modules.length}`;

    const content = formatContent(module.content);
    elements.moduleContent.innerHTML = content;

    const isCompleted = progress.completedModules && progress.completedModules.includes(currentModuleIndex);
    if (isCompleted) {
      elements.btnNext.textContent = currentModuleIndex === lessonData.modules.length - 1 
        ? '进入测试' 
        : '进入下一模块';
    } else {
      elements.btnNext.textContent = '我已理解，进入下一模块';
    }
  }

  function formatContent(content) {
    if (!content) return '<p>内容加载中...</p>';
    
    const paragraphs = content.split('\n\n');
    return paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
  }

  function showSummary() {
    const module = lessonData.modules[currentModuleIndex];
    if (!module || !module.summary) return;

    elements.summaryTitle.textContent = module.summary.title;
    
    elements.summaryPoints.innerHTML = '';
    module.summary.points.forEach(point => {
      const li = document.createElement('li');
      li.textContent = point;
      elements.summaryPoints.appendChild(li);
    });

    elements.summaryKey.textContent = module.summary.keyTakeaway;
    elements.summaryOverlay.classList.add('show');
  }

  function hideSummary() {
    elements.summaryOverlay.classList.remove('show');
  }

  function nextModule() {
    if (!progress.completedModules) {
      progress.completedModules = [];
    }
    
    if (!progress.completedModules.includes(currentModuleIndex)) {
      progress.completedModules.push(currentModuleIndex);
    }

    if (currentModuleIndex < lessonData.modules.length - 1) {
      currentModuleIndex++;
      progress.currentModule = currentModuleIndex;
      saveProgress();
      showModuleView();
      window.scrollTo(0, 0);
    } else {
      progress.quizStarted = true;
      progress.currentQuiz = 0;
      saveProgress();
      showQuizView();
      window.scrollTo(0, 0);
    }
  }

  function showQuizView() {
    elements.moduleView.classList.add('hidden');
    elements.quizView.classList.remove('hidden');
    elements.completeView.classList.add('hidden');
    
    renderQuiz();
  }

  function renderQuiz() {
    const quiz = lessonData.quiz[currentQuizIndex];
    if (!quiz) return;

    elements.quizProgressText.textContent = `第 ${currentQuizIndex + 1}/${lessonData.quiz.length} 题`;
    elements.quizQuestion.textContent = quiz.question;
    
    elements.quizOptions.innerHTML = '';
    quiz.options.forEach((option, index) => {
      const optionDiv = document.createElement('div');
      optionDiv.className = 'quiz-option';
      optionDiv.dataset.index = index;
      optionDiv.innerHTML = `
        <input type="radio" name="quiz-option" id="option-${index}" value="${index}">
        <label for="option-${index}">${option}</label>
      `;
      optionDiv.addEventListener('click', function() {
        selectOption(index);
      });
      elements.quizOptions.appendChild(optionDiv);
    });

    elements.quizFeedback.classList.add('hidden');
    elements.btnSubmitAnswer.classList.remove('hidden');
    elements.btnNextQuestion.classList.add('hidden');
    selectedAnswer = null;
  }

  function selectOption(index) {
    selectedAnswer = index;
    document.querySelectorAll('.quiz-option').forEach((opt, i) => {
      if (i === index) {
        opt.classList.add('selected');
        opt.querySelector('input').checked = true;
      } else {
        opt.classList.remove('selected');
        opt.querySelector('input').checked = false;
      }
    });
  }

  function submitAnswer() {
    if (selectedAnswer === null) {
      alert('请先选择一个答案');
      return;
    }

    const quiz = lessonData.quiz[currentQuizIndex];
    const isCorrect = selectedAnswer === quiz.correct;
    
    quizResults.push({
      questionId: quiz.id,
      correct: isCorrect
    });

    document.querySelectorAll('.quiz-option').forEach((opt, i) => {
      opt.classList.add('disabled');
      if (i === quiz.correct) {
        opt.classList.add('correct');
      } else if (i === selectedAnswer && !isCorrect) {
        opt.classList.add('wrong');
      }
    });

    elements.quizFeedback.className = 'quiz-feedback ' + (isCorrect ? 'correct' : 'wrong');
    elements.quizFeedback.innerHTML = `
      <div class="feedback-icon">${isCorrect ? '✓' : '✗'}</div>
      <div class="feedback-text">
        <strong>${isCorrect ? '回答正确！' : '回答错误'}</strong>
        <p>${quiz.explanation}</p>
      </div>
    `;
    elements.quizFeedback.classList.remove('hidden');
    
    elements.btnSubmitAnswer.classList.add('hidden');
    elements.btnNextQuestion.classList.remove('hidden');

    progress.quizResults = quizResults;
    progress.currentQuiz = currentQuizIndex;
    saveProgress();
  }

  function nextQuestion() {
    if (currentQuizIndex < lessonData.quiz.length - 1) {
      currentQuizIndex++;
      renderQuiz();
      window.scrollTo(0, 0);
    } else {
      progress.completed = true;
      saveProgress();
      showCompleteView();
      window.scrollTo(0, 0);
    }
  }

  function showCompleteView() {
    elements.moduleView.classList.add('hidden');
    elements.quizView.classList.add('hidden');
    elements.completeView.classList.remove('hidden');

    const correctCount = quizResults.filter(r => r.correct).length;
    const total = lessonData.quiz.length;
    const percentage = Math.round((correctCount / total) * 100);
    
    elements.completeScore.textContent = `${percentage}% (${correctCount}/${total})`;
  }

  function reviewModules() {
    progress = {
      currentModule: 0,
      completedModules: [],
      quizStarted: false,
      quizResults: [],
      completed: false
    };
    currentModuleIndex = 0;
    currentQuizIndex = 0;
    quizResults = [];
    saveProgress();
    showModuleView();
    window.scrollTo(0, 0);
  }

  // 数据已在head中预加载，DOM加载完成后直接初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM已经加载完成，立即初始化
    init();
  }
})();
