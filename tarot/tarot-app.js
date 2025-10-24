// 글로벌 변수
let scene, camera, renderer;
let cardMeshes = [];
let selectedCards = [];
let lastReadingTime = 0;
const COOLDOWN_MS = 20000; // 20초

// 쿨다운 체크
function checkCooldown() {
    const now = Date.now();
    const elapsed = now - lastReadingTime;

    if (lastReadingTime === 0) {
        return true; // 첫 리딩은 무료
    }

    if (elapsed < COOLDOWN_MS) {
        const remaining = Math.ceil((COOLDOWN_MS - elapsed) / 1000);
        document.getElementById('cooldownMessage').style.display = 'block';
        document.getElementById('cooldownTimer').textContent = remaining;

        const countdown = setInterval(() => {
            const newElapsed = Date.now() - lastReadingTime;
            const newRemaining = Math.ceil((COOLDOWN_MS - newElapsed) / 1000);

            if (newRemaining <= 0) {
                clearInterval(countdown);
                document.getElementById('cooldownMessage').style.display = 'none';
            } else {
                document.getElementById('cooldownTimer').textContent = newRemaining;
            }
        }, 1000);

        return false;
    }

    document.getElementById('cooldownMessage').style.display = 'none';
    return true;
}

// 타로 리딩 시작
function startReading() {
    const question = document.getElementById('question').value.trim();

    if (!question) {
        alert('질문을 입력해주세요!');
        return;
    }

    if (!checkCooldown()) {
        return;
    }

    // 카드 뽑기
    selectedCards = drawCards(3);
    lastReadingTime = Date.now();

    // UI 업데이트
    document.getElementById('questionSection').style.display = 'none';
    document.getElementById('canvasContainer').style.display = 'block';

    // 3D 카드 애니메이션 시작
    init3DCards();
    animateCardSpread();
}

// 3D 카드 초기화
function init3DCards() {
    const container = document.getElementById('canvas3d');
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene 생성
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x14002d);

    // Camera 생성
    camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 12);

    // Renderer 생성
    renderer = new THREE.WebGLRenderer({ antialias: true, canvas: container });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;

    // 조명
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xda70d6, 1.5);
    pointLight.position.set(0, 5, 10);
    scene.add(pointLight);

    // 카드 생성
    cardMeshes = [];
    const cardGeometry = new THREE.PlaneGeometry(2, 3);

    selectedCards.forEach((card, index) => {
        const loader = new THREE.TextureLoader();
        const texture = loader.load(card.image);

        const cardMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            side: THREE.DoubleSide
        });

        const cardMesh = new THREE.Mesh(cardGeometry, cardMaterial);
        cardMesh.position.set(0, 0, -index * 0.1);
        cardMesh.userData = { index, card, targetX: (index - 1) * 2.5 };

        cardMeshes.push(cardMesh);
        scene.add(cardMesh);
    });

    // 마우스 이벤트
    let mouse = new THREE.Vector2();
    let raycaster = new THREE.Raycaster();
    let hoveredCard = null;

    container.addEventListener('mousemove', (event) => {
        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(cardMeshes);

        if (hoveredCard) {
            hoveredCard.scale.set(1, 1, 1);
            hoveredCard.position.y = 0;
        }

        if (intersects.length > 0) {
            hoveredCard = intersects[0].object;
            hoveredCard.scale.set(1.1, 1.1, 1.1);
            hoveredCard.position.y = 0.3;
        } else {
            hoveredCard = null;
        }
    });

    // 렌더링 루프
    function animate() {
        requestAnimationFrame(animate);

        cardMeshes.forEach(mesh => {
            mesh.rotation.y += 0.002;
        });

        renderer.render(scene, camera);
    }
    animate();

    // 윈도우 리사이즈
    window.addEventListener('resize', () => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    });
}

// 카드 펼치기 애니메이션
function animateCardSpread() {
    let progress = 0;
    const duration = 2000; // 2초
    const startTime = Date.now();

    function spread() {
        progress = (Date.now() - startTime) / duration;

        if (progress < 1) {
            cardMeshes.forEach(mesh => {
                const targetX = mesh.userData.targetX;
                const currentX = mesh.position.x;
                mesh.position.x = currentX + (targetX - currentX) * 0.1;
                mesh.rotation.y = Math.PI * 2 * (1 - progress);
            });

            requestAnimationFrame(spread);
        } else {
            // 애니메이션 완료 후 해석 요청
            setTimeout(() => {
                requestInterpretation();
            }, 500);
        }
    }

    spread();
}

// 타로 해석 요청 (LLM)
async function requestInterpretation() {
    const question = document.getElementById('question').value;
    const cardNames = selectedCards.map(c => c.name).join(', ');

    // 로딩 표시
    document.getElementById('readingSection').style.display = 'block';
    document.getElementById('readingSection').innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>카드를 해석하는 중...</p>
        </div>
    `;

    try {
        const response = await fetch('/api/tarot/interpret', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question: question,
                cards: selectedCards.map(c => c.name)
            })
        });

        if (!response.ok) {
            throw new Error('해석 요청 실패');
        }

        const data = await response.json();
        displayInterpretation(data.interpretation);

    } catch (error) {
        console.error('Error:', error);
        // 임시 해석 (서버가 없을 때)
        displayMockInterpretation();
    }
}

// Mock 해석 (개발용)
function displayMockInterpretation() {
    const interpretations = [
        `현재 상황은 <span class="highlight">새로운 시작</span>을 암시하고 있습니다. ${selectedCards[0].name} 카드는 당신이 <span class="highlight">용기</span>를 가지고 나아가야 할 때임을 보여줍니다.`,
        `${selectedCards[1].name}은(는) <span class="highlight">내면의 성장</span>과 관련이 깊습니다. 지금은 <span class="highlight">인내심</span>을 가지고 기다리는 것이 중요합니다.`,
        `${selectedCards[2].name}은(는) <span class="highlight">긍정적인 변화</span>를 예고합니다. <span class="highlight">믿음</span>을 가지고 앞으로 나아가세요.`
    ];

    const fullInterpretation = `
        <h3 style="color: #ffd700; margin-bottom: 20px;">🌟 종합 해석</h3>
        <p style="margin-bottom: 30px;">
            당신의 질문에 대한 카드들의 메시지입니다.
            ${selectedCards[0].name}, ${selectedCards[1].name}, ${selectedCards[2].name}이(가) 나타났습니다.
        </p>
        <div class="card-info">
            <div class="card-name">🎴 ${selectedCards[0].name} (과거/원인)</div>
            <div class="interpretation">${interpretations[0]}</div>
        </div>
        <div class="card-info">
            <div class="card-name">🎴 ${selectedCards[1].name} (현재/상황)</div>
            <div class="interpretation">${interpretations[1]}</div>
        </div>
        <div class="card-info">
            <div class="card-name">🎴 ${selectedCards[2].name} (미래/결과)</div>
            <div class="interpretation">${interpretations[2]}</div>
        </div>
        <div style="margin-top: 30px; padding: 20px; background: rgba(138, 43, 226, 0.2); border-radius: 10px;">
            <p><strong>조언:</strong> 타로는 가능성을 보여줄 뿐, 최종 선택은 당신의 몫입니다.
            카드의 메시지를 참고하되, <span class="highlight">자신의 직관</span>을 믿으세요.</p>
        </div>
    `;

    displayInterpretation(fullInterpretation);
}

// 해석 결과 표시
function displayInterpretation(interpretation) {
    document.getElementById('readingSection').innerHTML = `
        <h2 style="margin-bottom: 20px;">🌟 타로 리딩 결과</h2>
        <div id="interpretation" class="interpretation">
            ${interpretation}
        </div>
        <div style="text-align: center; margin-top: 30px;">
            <button class="btn btn-primary" onclick="resetReading()">
                🔄 다시 보기
            </button>
        </div>
    `;
}

// 리셋
function resetReading() {
    // 3D 씬 정리
    if (renderer) {
        renderer.dispose();
        scene.clear();
    }

    // UI 리셋
    document.getElementById('questionSection').style.display = 'block';
    document.getElementById('canvasContainer').style.display = 'none';
    document.getElementById('readingSection').style.display = 'none';
    document.getElementById('question').value = '';

    selectedCards = [];
    cardMeshes = [];
}

// 페이지 로드 시 쿨다운 체크
window.addEventListener('load', () => {
    // localStorage에서 마지막 리딩 시간 복구
    const saved = localStorage.getItem('lastTarotReading');
    if (saved) {
        lastReadingTime = parseInt(saved);
        checkCooldown();
    }
});

// 리딩 시간 저장
window.addEventListener('beforeunload', () => {
    if (lastReadingTime > 0) {
        localStorage.setItem('lastTarotReading', lastReadingTime.toString());
    }
});
