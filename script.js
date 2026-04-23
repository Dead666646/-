// ===== GAME STATE =====
let gameState = {
    selectedRoles: [],
    currentRound: 0,
    totalRounds: 6,
    damage: 0,
    score: 0,
    timeLeft: 300,
    timerInterval: null,
    events: [],
    decisions: [],
    startTime: null,
    roundTimes: [],
    gameOver: false
};

// ===== SCENARIOS =====
const scenarios = [
    {
        round: 1, phase: "ОБНАРУЖЕНИЕ", role: "it", roleName: "💻 IT-Специалист",
        text: "🚨 ВНИМАНИЕ: Системы мониторинга обнаружили аномальную активность в серверной сети бюджетного учреждения. Несколько файлов зашифрованы. Что предпримет IT-специалист в первую очередь?",
        actions: [
            { text: "Немедленно изолировать заражённые сегменты сети", desc: "Быстрое решение, но может нарушить работу легитимных сервисов", effect: { damage: 5, score: 15, log: "good" }, logText: "✅ Сегменты сети изолированы. Ущерб сдержан." },
            { text: "Создать образы дисков для криминалистического анализа", desc: "Сохранит доказательства, но займёт время", effect: { damage: 12, score: 10, log: "neutral" }, logText: "📀 Образы созданы. Расследование возможно, но атака продолжается." },
            { text: "Сразу начать восстановление из резервных копий", desc: "Быстрое восстановление, но без анализа угрозы", effect: { damage: 8, score: 8, log: "neutral" }, logText: "💾 Восстановление запущено, но источник атаки не определён." }
        ]
    },
    {
        round: 2, phase: "АНАЛИЗ УГРОЗЫ", role: "mgmt", roleName: "🎯 Руководство",
        text: "📊 IT-отдел подтверждает: это целевая атака с использованием шифровальщика. Злоумышленники требуют выкуп в 50 BTC. Руководство должно принять стратегическое решение.",
        actions: [
            { text: "Отказаться от переговоров, привлечь ФСБ и CERT", desc: "Правильное решение, но процесс будет долгим", effect: { damage: 10, score: 20, log: "good" }, logText: "🛡️ Подключены спецслужбы. Стратегия защиты утверждена." },
            { text: "Начать тайные переговоры для выигрыша времени", desc: "Рискованно — может нарушить закон", effect: { damage: 15, score: 5, log: "bad" }, logText: "⚠️ Начаты переговоры. Юридические риски возрастают." },
            { text: "Объявить режим ЧС и перевести систему на бумажный документооборот", desc: "Обеспечит непрерывность работы", effect: { damage: 18, score: 12, log: "neutral" }, logText: "📋 Режим ЧС активирован. Бумажный режим введён." }
        ]
    },
    {
        round: 3, phase: "УТЕЧКА ИНФОРМАЦИИ", role: "pr", roleName: "📢 PR-Служба",
        text: "📰 Журналисты получили анонимную информацию об атаке и готовят публикацию. В соцсетях уже появляются слухи. PR-служба должна действовать немедленно.",
        actions: [
            { text: "Оперативно выпустить официальный пресс-релиз с фактами", desc: "Прозрачность снижает панику", effect: { damage: 5, score: 18, log: "good" }, logText: "📢 Пресс-релиз опубликован. Доверие общественности сохранено." },
            { text: "Отказаться от комментариев до завершения расследования", desc: "Избежит ошибок, но создаст информационный вакуум", effect: { damage: 12, score: 8, log: "neutral" }, logText: "🤫 Комментарии приостановлены. Слухи усиливаются." },
            { text: "Запустить кампанию по опровержению фейков в соцсетях", desc: "Активная работа с общественностью", effect: { damage: 8, score: 14, log: "good" }, logText: "📱 Кампания запущена. Основные фейки опровергнуты." }
        ]
    },
    {
        round: 4, phase: "ПРАВОВАЯ ОЦЕНКА", role: "lawyer", roleName: "⚖️ Юрист",
        text: "⚖️ По закону №187-ФЗ, инцидент подлежит обязательному уведомлению ФСТЭК и Роскомнадзора. Утечка персональных данных граждан подтверждена. Какие шаги предпримет юрист?",
        actions: [
            { text: "Немедленно уведомить ФСТЭК, Роскомнадзор и МВД", desc: "Полное соблюдение закона, штрафы могут быть снижены", effect: { damage: 3, score: 20, log: "good" }, logText: "✅ Все регуляторы уведомлены. Штрафы минимизированы." },
            { text: "Провести внутренний аудит перед уведомлением", desc: "Даст точную картину, но нарушит сроки уведомления", effect: { damage: 10, score: 12, log: "neutral" }, logText: "📋 Аудит запущен. Уведомление регуляторов задерживается." },
            { text: "Уведомить только ФСТЭК, ограничив круг лиц", desc: "Риск — неполное уведомление", effect: { damage: 8, score: 10, log: "neutral" }, logText: "⚠️ ФСТЭК уведомлён. Роскомнадзор не в курсе — возможны санкции." }
        ]
    },
    {
        round: 5, phase: "ЭСКАЛАЦИЯ АТАКИ", role: "it", roleName: "💻 IT-Специалист",
        text: "🔴 ВТОРЖЕНИЕ УГЛУБЛЯЕТСЯ: Злоумышленники обнаружили бэкдор и получили доступ к архивным базам данных за 5 лет. Обнаружена активность в системе электронных платежей. Критическая ситуация!",
        actions: [
            { text: "Полное отключение внешних интерфейсов системы", desc: "Остановит атаку, но парализует все электронные платежи", effect: { damage: 10, score: 18, log: "good" }, logText: "🔌 Внешние интерфейсы отключены. Атака остановлена." },
            { text: "Развернуть honeypot для отслеживания действий злоумышленников", desc: "Позволит собрать разведданные, но риск утечки сохраняется", effect: { damage: 20, score: 12, log: "neutral" }, logText: "🍯 Honeypot развёрнут. Собираем данные о злоумышленниках." },
            { text: "Экстренно применить патчи безопасности из резервного контура", desc: "Быстрое исправление, но может быть неполным", effect: { damage: 15, score: 14, log: "neutral" }, logText: "🔧 Патчи применены. Часть уязвимостей закрыта." }
        ]
    },
    {
        round: 6, phase: "ЛИКВИДАЦИЯ ПОСЛЕДСТВИЙ", role: "mgmt", roleName: "🎯 Руководство",
        text: "📋 Атака сдержана, но последствия значительны. Необходимо принять финальные решения по восстановлению. Доступен ограниченный бюджет на восстановление. Как распорядиться ресурсами?",
        actions: [
            { text: "Полное восстановление систем с нуля + усиление защиты", desc: "Дорого, но надёжно. Полная перестройка инфраструктуры", effect: { damage: 5, score: 25, log: "good" }, logText: "🏗️ Системы восстановлены с нуля. Защита усилена." },
            { text: "Восстановить критически важные модули в приоритетном порядке", desc: "Быстро, но некоторые системы останутся уязвимыми", effect: { damage: 12, score: 15, log: "neutral" }, logText: "⚡ Критические модули восстановлены. Остальные в очереди." },
            { text: "Временное решение с планом модернизации на следующий год", desc: "Дешево сейчас, но риски сохранятся", effect: { damage: 20, score: 8, log: "bad" }, logText: "⏳ Временное решение принято. Риски остаются высокими." }
        ]
    }
];

const gapEvents = {
    it_missing: { text: "⚠️ БЕЗ IT-СПЕЦИАЛИСТА: Без квалифицированного технического специалиста время на анализ угрозы увеличивается.", effect: { damage: 15, score: -5, log: "bad" }, logText: "❌ Нет IT-специалиста. Техническая защита ослаблена." },
    lawyer_missing: { text: "⚠️ БЕЗ ЮРИСТА: Уведомление регуляторов задерживается. Возможны крупные штрафы.", effect: { damage: 8, score: -8, log: "bad" }, logText: "❌ Нет юриста. Правовые последствия усугубляются." },
    pr_missing: { text: "⚠️ БЕЗ PR-СЛУЖБЫ: Информационный вакуум заполняется слухами. Репутация страдает.", effect: { damage: 10, score: -5, log: "bad" }, logText: "❌ Нет PR-службы. Репутационный ущерб растёт." },
    mgmt_missing: { text: "⚠️ БЕЗ РУКОВОДСТВА: Решения принимаются хаотично. Нет единой стратегии.", effect: { damage: 12, score: -8, log: "bad" }, logText: "❌ Нет руководства. Координация нарушена." }
};
function goToScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function toggleRole(card) {
    const role = card.dataset.role;
    if (card.classList.contains('selected')) {
        card.classList.remove('selected');
        gameState.selectedRoles = gameState.selectedRoles.filter(r => r !== role);
    } else {
        if (gameState.selectedRoles.length >= 4) return;
        card.classList.add('selected');
        gameState.selectedRoles.push(role);
    }
    updateSelectionCount();
}

function updateSelectionCount() {
    const count = gameState.selectedRoles.length;
    document.getElementById('selection-count').textContent = `Выбрано: ${count} / 4`;
    document.getElementById('btn-confirm-roles').disabled = count < 2;
}

function confirmRoles() {
    if (gameState.selectedRoles.length < 2) return;
    startGame();
}
function startGame() {
    gameState.currentRound = 0;
    gameState.damage = 0;
    gameState.score = 0;
    gameState.timeLeft = 300;
    gameState.decisions = [];
    gameState.roundTimes = [];
    gameState.gameOver = false;
    gameState.startTime = Date.now();

    const allRoles = ['it', 'lawyer', 'pr', 'mgmt'];
    const missingRoles = allRoles.filter(r => !gameState.selectedRoles.includes(r));

    missingRoles.forEach(role => {
        const key = role + '_missing';
        if (gapEvents[key]) {
            gameState.damage = Math.min(100, gameState.damage + gapEvents[key].effect.damage);
            gameState.score += gapEvents[key].effect.score;
        }
    });

    goToScreen('screen-game');
    renderActiveRoles();
    updateDamageBar();
    updateTimerDisplay();
    startTimer();
    loadRound();
}

function renderActiveRoles() {
    const container = document.getElementById('active-roles');
    const roleInfo = {
        it: { class: 'it', label: '💻 IT' },
        lawyer: { class: 'lawyer', label: '⚖️ Юрист' },
        pr: { class: 'pr', label: '📢 PR' },
        mgmt: { class: 'mgmt', label: '🎯 Упр.' }
    };
    container.innerHTML = gameState.selectedRoles.map(role =>
        `<span class="active-role-badge ${roleInfo[role].class}">${roleInfo[role].label}</span>`
    ).join('');
}
function startTimer() {
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = setInterval(() => {
        if (gameState.gameOver) { clearInterval(gameState.timerInterval); return; }
        gameState.timeLeft--;
        updateTimerDisplay();
        if (gameState.timeLeft <= 0) endGame('time');
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(gameState.timeLeft / 60);
    const seconds = gameState.timeLeft % 60;
    const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    const el = document.getElementById('timer-display');
    el.textContent = display;
    el.classList.remove('warning', 'danger');
    if (gameState.timeLeft <= 60) el.classList.add('danger');
    else if (gameState.timeLeft <= 120) el.classList.add('warning');
}
function updateDamageBar() {
    const damage = Math.min(100, Math.max(0, gameState.damage));
    document.getElementById('damage-bar').style.width = damage + '%';
    document.getElementById('damage-percent').textContent = Math.round(damage) + '%';
    document.getElementById('damage-value').textContent = Math.round(damage) + '%';

    const bar = document.getElementById('damage-bar');
    if (damage >= 70) bar.style.background = 'linear-gradient(90deg, #ff4400, #ff0044)';
    else if (damage >= 40) bar.style.background = 'linear-gradient(90deg, #ffaa00, #ff4400)';
    else bar.style.background = 'linear-gradient(90deg, var(--neon-yellow), var(--neon-red))';
}
function loadRound() {
    if (gameState.currentRound >= gameState.totalRounds || gameState.damage >= 100) {
        endGame(gameState.damage >= 100 ? 'defeat' : 'completed');
        return;
    }

    const scenario = scenarios[gameState.currentRound];
    gameState.roundTimes.push(Date.now());

    document.getElementById('phase-display').textContent = `ФАЗА ${scenario.round} / ${gameState.totalRounds}`;
    document.getElementById('round-display').textContent = `РАУНД: ${scenario.phase}`;

    const hasRole = gameState.selectedRoles.includes(scenario.role);
    const roleBadge = document.getElementById('scenario-role');
    roleBadge.textContent = hasRole ? scenario.roleName : `⚠️ ${scenario.roleName} — НЕТ В КОМАНДЕ`;
    roleBadge.style.background = hasRole ? 'rgba(0,255,136,0.15)' : 'rgba(255,0,68,0.15)';
    roleBadge.style.border = `1px solid ${hasRole ? 'var(--neon-green)' : 'var(--neon-red)'}`;
    roleBadge.style.color = hasRole ? 'var(--neon-green)' : 'var(--neon-red)';

    document.getElementById('scenario-text').textContent = scenario.text;
    const btnContainer = document.getElementById('action-buttons');
    const keys = ['A', 'B', 'C'];

    if (!hasRole) {
        btnContainer.innerHTML = `
      <button class="action-btn" onclick="makeDecision(${gameState.currentRound}, 0, true)">
        <span class="action-key">A</span>
        <div><div>Действовать без эксперта (высокий риск)</div><div class="action-desc">Решение без квалификации — возможны ошибки</div></div>
      </button>
      <button class="action-btn" onclick="makeDecision(${gameState.currentRound}, 1, true)">
        <span class="action-key">B</span>
        <div><div>Пропустить этап и перейти к следующему</div><div class="action-desc">Потеря времени, но минимальный дополнительный ущерб</div></div>
      </button>`;
    } else {
        btnContainer.innerHTML = scenario.actions.map((action, i) => `
      <button class="action-btn" onclick="makeDecision(${gameState.currentRound}, ${i}, false)">
        <span class="action-key">${keys[i]}</span>
        <div><div>${action.text}</div><div class="action-desc">${action.desc}</div></div>
      </button>`).join('');
    }

    const panel = document.getElementById('decision-panel');
    panel.style.animation = 'none';
    panel.offsetHeight;
    panel.style.animation = 'fadeIn 0.5s ease';
}

function makeDecision(roundIndex, actionIndex, isPenalty) {
    const scenario = scenarios[roundIndex];
    const roundTime = ((Date.now() - gameState.roundTimes[roundIndex]) / 1000).toFixed(1);

    if (isPenalty) {
        const gapEvent = gapEvents[scenario.role + '_missing'];
        const multiplier = actionIndex === 0 ? 0.8 : 0.5;
        gameState.damage = Math.min(100, gameState.damage + gapEvent.effect.damage * multiplier);
        gameState.score += Math.round(gapEvent.effect.score * multiplier);
        addLogEntry(`Раунд ${roundIndex + 1} (${scenario.phase}): ${gapEvent.logText} Время: ${roundTime}с`, 'bad');
        gameState.decisions.push({ round: roundIndex + 1, phase: scenario.phase, action: actionIndex === 0 ? 'Риск без эксперта' : 'Пропуск этапа', time: roundTime, penalty: true });
    } else {
        const action = scenario.actions[actionIndex];
        const effect = action.effect;
        gameState.damage = Math.min(100, gameState.damage + effect.damage);
        gameState.score += effect.score;
        const speedBonus = Math.max(0, Math.floor(30 - parseFloat(roundTime)));
        gameState.score += speedBonus;
        addLogEntry(`Раунд ${roundIndex + 1} (${scenario.phase}): ${action.logText} +${speedBonus} за скорость (${roundTime}с)`, effect.log);
        gameState.decisions.push({ round: roundIndex + 1, phase: scenario.phase, action: action.text, time: roundTime, damage: effect.damage, score: effect.score, speedBonus });
    }

    updateDamageBar();
    if (gameState.damage >= 100) { endGame('defeat'); return; }
    gameState.currentRound++;
    setTimeout(() => loadRound(), 800);
}
function addLogEntry(text, type) {
    const log = document.getElementById('event-log');
    const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.innerHTML = `<span class="timestamp">[${time}]</span> ${text}`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}
function endGame(reason) {
    gameState.gameOver = true;
    clearInterval(gameState.timerInterval);

    const totalTime = ((Date.now() - gameState.startTime) / 1000).toFixed(1);
    const timeBonus = Math.max(0, Math.floor(gameState.timeLeft / 10));
    let finalScore = gameState.score + timeBonus;
    if (gameState.damage >= 80) finalScore = Math.floor(finalScore * 0.6);
    else if (gameState.damage >= 50) finalScore = Math.floor(finalScore * 0.8);
    else if (gameState.damage >= 30) finalScore = Math.floor(finalScore * 0.95);
    finalScore = Math.max(0, finalScore);

    let rating, ratingColor;
    if (finalScore >= 120) { rating = 'ЭЛИТНЫЙ ЗАЩИТНИК'; ratingColor = 'var(--neon-green)'; }
    else if (finalScore >= 80) { rating = 'ОПЫТНЫЙ ОПЕРАТОР'; ratingColor = 'var(--neon-cyan)'; }
    else if (finalScore >= 40) { rating = 'НАЧИНАЮЩИЙ'; ratingColor = 'var(--neon-yellow)'; }
    else { rating = 'ТРЕБУЕТСЯ ОБУЧЕНИЕ'; ratingColor = 'var(--neon-red)'; }

    animateScore(document.getElementById('result-score'), finalScore);
    document.getElementById('result-rating').textContent = rating;
    document.getElementById('result-rating').style.color = ratingColor;

    document.getElementById('result-stats').innerHTML = `
    <div class="col-6 col-md-3"><div class="stat-item"><div class="stat-label">ОБЩИЙ УЩЕРБ</div><div class="stat-value" style="color:${gameState.damage >= 70 ? 'var(--neon-red)' : 'var(--neon-yellow)'}">${Math.round(gameState.damage)}%</div></div></div>
    <div class="col-6 col-md-3"><div class="stat-item"><div class="stat-label">ВРЕМЯ РЕАГИРОВАНИЯ</div><div class="stat-value">${totalTime}с</div></div></div>
    <div class="col-6 col-md-3"><div class="stat-item"><div class="stat-label">РОЛЕЙ В КОМАНДЕ</div><div class="stat-value">${gameState.selectedRoles.length}/4</div></div></div>
    <div class="col-6 col-md-3"><div class="stat-item"><div class="stat-label">РЕШЕНИЙ ПРИНЯТО</div><div class="stat-value">${gameState.decisions.length}/${gameState.totalRounds}</div></div></div>`;

    let detailsHTML = '<h4 style="font-family:Orbitron;color:var(--neon-cyan);font-size:0.8rem;letter-spacing:2px;margin-bottom:15px;">ДЕТАЛИ РАУНДОВ</h4>';
    gameState.decisions.forEach(d => {
        detailsHTML += `<div class="detail-row"><span class="detail-label">Раунд ${d.round} (${d.phase})</span><span class="detail-value ${d.penalty ? 'bad' : 'good'}">${d.action} — ${d.time}с</span></div>`;
    });
    document.getElementById('result-details').innerHTML = detailsHTML;

    gameState.finalScore = finalScore;
    gameState.totalTime = totalTime;

    goToScreen('screen-results');
    setTimeout(() => document.getElementById('modal-name').classList.add('active'), 1000);
}

function animateScore(el, target) {
    let current = 0;
    const step = Math.max(1, Math.floor(target / 40));
    const interval = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(interval); }
        el.textContent = current;
        el.className = 'result-score';
        if (current >= 120) el.classList.add('excellent');
        else if (current >= 80) el.classList.add('good');
        else if (current >= 40) el.classList.add('average');
        else el.classList.add('poor');
    }, 30);
}

function surrender() {
    if (confirm('Вы уверены? Миссия будет провалена.')) endGame('surrender');
}
function saveResult() {
    const name = document.getElementById('player-name').value.trim() || 'Аноним';
    const results = JSON.parse(localStorage.getItem('cyberpolygon_results') || '[]');
    results.push({ name, score: gameState.finalScore, damage: Math.round(gameState.damage), time: gameState.totalTime, roles: gameState.selectedRoles.length, date: new Date().toLocaleDateString('ru-RU'), timestamp: Date.now() });
    results.sort((a, b) => b.score - a.score);
    if (results.length > 10) results.length = 10;
    localStorage.setItem('cyberpolygon_results', JSON.stringify(results));
    document.getElementById('modal-name').classList.remove('active');
}

function skipSave() {
    document.getElementById('modal-name').classList.remove('active');
}

function showLeaderboard() {
    const results = JSON.parse(localStorage.getItem('cyberpolygon_results') || '[]');
    const tbody = document.getElementById('leaderboard-body');
    const noRecords = document.getElementById('no-records');

    if (results.length === 0) {
        tbody.innerHTML = '';
        noRecords.classList.remove('d-none');
    } else {
        noRecords.classList.add('d-none');
        tbody.innerHTML = results.map((r, i) => {
            let rankClass = '';
            if (i === 0) rankClass = 'rank-1';
            else if (i === 1) rankClass = 'rank-2';
            else if (i === 2) rankClass = 'rank-3';
            return `<tr class="${rankClass}">
        <td><span class="rank-badge">${i + 1}</span></td>
        <td style="color:var(--text-main); font-weight:700;">${r.name}</td>
        <td style="color:var(--neon-cyan); font-weight:700;">${r.score}</td>
        <td style="color:${r.damage >= 70 ? 'var(--neon-red)' : 'var(--neon-yellow)'};">${r.damage}%</td>
        <td>${r.time}с</td>
        <td>${r.date}</td>
      </tr>`;
        }).join('');
    }
    goToScreen('screen-leaderboard');
}

function restartGame() {
    gameState.selectedRoles = [];
    document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
    updateSelectionCount();
    document.getElementById('event-log').innerHTML = '<h4 class="small text-secondary mb-3" style="font-family:\'Orbitron\'; letter-spacing:3px; text-transform:uppercase;">📋 ЖУРНАЛ СОБЫТИЙ</h4>';
    document.getElementById('player-name').value = '';
    goToScreen('screen-roles');
}
function createParticles() {
    for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.animationDuration = (Math.random() * 15 + 10) + 's';
        p.style.animationDelay = (Math.random() * 10) + 's';
        p.style.width = p.style.height = (Math.random() * 3 + 1) + 'px';
        if (Math.random() > 0.5) p.style.background = 'var(--neon-magenta)';
        document.body.appendChild(p);
    }
}

document.addEventListener('keydown', (e) => {
    const key = e.key.toUpperCase();
    if (['A', 'B', 'C'].includes(key)) {
        const buttons = document.querySelectorAll('.action-btn');
        const index = ['A', 'B', 'C'].indexOf(key);
        if (index < buttons.length) buttons[index].click();
    }
});

document.getElementById('player-name').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveResult();
});

document.addEventListener('DOMContentLoaded', () => {
    createParticles();
});
