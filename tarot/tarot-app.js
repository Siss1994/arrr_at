// 글로벌 변수
let scene, camera, renderer;
let cardMeshes = [];
let allCards = []; // 섞인 전체 카드 덱
let selectedCards = []; // 사용자가 선택한 카드
let lastReadingTime = 0;
const COOLDOWN_MS = 20000; // 20초
const API_ENDPOINT = 'http://localhost:5051/api/tarot/interpret'; // LLM 서버 주소

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

    // 전체 카드 덱 섞기
    allCards = shuffleDeck();
    selectedCards = [];

    // UI 업데이트
    document.getElementById('questionSection').style.display = 'none';
    document.getElementById('canvasContainer').style.display = 'block';

    // 카드 선택 안내 표시
    showSelectionGuide();

    // 3D 카드 애니메이션 시작 (모든 카드 표시)
    init3DCards();
    animateCardSpread();
}

// 카드 선택 가이드 표시
function showSelectionGuide() {
    const guide = document.createElement('div');
    guide.id = 'selectionGuide';
    guide.style.cssText = `
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(138, 43, 226, 0.9);
        padding: 15px 30px;
        border-radius: 10px;
        color: white;
        font-size: 1.2rem;
        font-weight: bold;
        z-index: 1000;
        text-align: center;
    `;
    guide.innerHTML = '✨ 직관에 따라 카드 3장을 선택하세요 (0/3) ✨';

    const container = document.getElementById('canvasContainer');
    container.appendChild(guide);
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
    camera.position.set(0, 2, 15);

    // Renderer 생성
    renderer = new THREE.WebGLRenderer({ antialias: true, canvas: container });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;

    // 조명
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xda70d6, 1.5);
    pointLight.position.set(0, 5, 10);
    scene.add(pointLight);

    // 카드 뒷면 텍스처
    const backTexture = new THREE.TextureLoader().load('cards/card_back.png',
        () => {},
        undefined,
        () => {
            // 카드 뒷면 이미지 없으면 컬러로 대체
        }
    );

    // 선택 가능한 카드 생성 (10장만 표시)
    cardMeshes = [];
    const cardGeometry = new THREE.PlaneGeometry(2, 3);
    const displayCards = allCards.slice(0, 10); // 처음 10장만 표시

    displayCards.forEach((card, index) => {
        const cardMaterial = new THREE.MeshStandardMaterial({
            color: 0x4b0082,
            side: THREE.DoubleSide
        });

        const cardMesh = new THREE.Mesh(cardGeometry, cardMaterial);
        cardMesh.position.set(0, 0, -index * 0.1);
        cardMesh.userData = {
            index,
            card,
            targetX: (index - 5) * 2.2,
            selected: false
        };

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
        const intersects = raycaster.intersectObjects(cardMeshes.filter(m => !m.userData.selected));

        if (hoveredCard && !hoveredCard.userData.selected) {
            hoveredCard.scale.set(1, 1, 1);
            hoveredCard.position.y = 0;
        }

        if (intersects.length > 0) {
            hoveredCard = intersects[0].object;
            hoveredCard.scale.set(1.15, 1.15, 1.15);
            hoveredCard.position.y = 0.5;
            container.style.cursor = 'pointer';
        } else {
            hoveredCard = null;
            container.style.cursor = 'default';
        }
    });

    // 클릭 이벤트 - 카드 선택
    container.addEventListener('click', (event) => {
        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(cardMeshes.filter(m => !m.userData.selected));

        if (intersects.length > 0 && selectedCards.length < 3) {
            const clickedCard = intersects[0].object;
            selectCard(clickedCard);
        }
    });

    // 렌더링 루프
    function animate() {
        requestAnimationFrame(animate);

        cardMeshes.forEach(mesh => {
            if (!mesh.userData.selected) {
                mesh.rotation.y += 0.005;
            }
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

// 카드 선택 처리
function selectCard(cardMesh) {
    cardMesh.userData.selected = true;
    selectedCards.push(cardMesh.userData.card);

    // 선택된 카드 시각적 효과
    cardMesh.material.color.setHex(0xda70d6);
    cardMesh.material.emissive = new THREE.Color(0xff00ff);
    cardMesh.material.emissiveIntensity = 0.5;

    // 선택 가이드 업데이트
    const guide = document.getElementById('selectionGuide');
    if (guide) {
        guide.innerHTML = `✨ 직관에 따라 카드 3장을 선택하세요 (${selectedCards.length}/3) ✨`;
    }

    // 3장 선택 완료
    if (selectedCards.length === 3) {
        setTimeout(() => {
            lastReadingTime = Date.now();
            requestInterpretation();
        }, 500);
    }
}

// 카드 펼치기 애니메이션
function animateCardSpread() {
    let progress = 0;
    const duration = 1500; // 1.5초
    const startTime = Date.now();

    function spread() {
        progress = (Date.now() - startTime) / duration;

        if (progress < 1) {
            cardMeshes.forEach(mesh => {
                const targetX = mesh.userData.targetX;
                const currentX = mesh.position.x;
                mesh.position.x = currentX + (targetX - currentX) * 0.1;
            });

            requestAnimationFrame(spread);
        }
    }

    spread();
}

// 타로 해석 요청 (LLM)
async function requestInterpretation() {
    const question = document.getElementById('question').value;

    // 3D 캔버스 숨기기
    document.getElementById('canvasContainer').style.display = 'none';

    // 로딩 표시
    document.getElementById('readingSection').style.display = 'block';
    document.getElementById('readingSection').innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>🔮 AI가 카드를 해석하고 있습니다...</p>
            <p style="margin-top: 10px; font-size: 0.9rem; color: #c8b3ff;">선택한 카드: ${selectedCards.map(c => c.name).join(', ')}</p>
        </div>
    `;

    try {
        const response = await fetch(API_ENDPOINT, {
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
            throw new Error(`서버 오류: ${response.status}`);
        }

        const data = await response.json();

        if (data.fallback) {
            // Fallback 모드인 경우 알림
            displayInterpretation(data.interpretation +
                '<p style="margin-top: 20px; padding: 15px; background: rgba(255, 200, 0, 0.2); border-radius: 8px; color: #ffd700;">' +
                '⚠️ LLM 서버가 응답하지 않아 기본 해석을 제공합니다.</p>');
        } else {
            displayInterpretation(data.interpretation);
        }

    } catch (error) {
        console.error('API Error:', error);

        // 서버 연결 실패 시 Mock 데이터 사용
        document.getElementById('readingSection').innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h3 style="color: #ff6b6b; margin-bottom: 20px;">❌ 서버 연결 실패</h3>
                <p style="margin-bottom: 15px;">타로 LLM 서버에 연결할 수 없습니다.</p>
                <p style="font-size: 0.9rem; color: #c8b3ff;">서버가 실행 중인지 확인해주세요: ${API_ENDPOINT}</p>
                <p style="margin-top: 20px; color: #9370db;">임시 해석을 표시합니다...</p>
            </div>
        `;

        setTimeout(() => {
            displayMockInterpretation();
        }, 2000);
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

    // 선택 가이드 제거
    const guide = document.getElementById('selectionGuide');
    if (guide) {
        guide.remove();
    }

    // UI 리셋
    document.getElementById('questionSection').style.display = 'block';
    document.getElementById('canvasContainer').style.display = 'none';
    document.getElementById('readingSection').style.display = 'none';
    document.getElementById('question').value = '';

    selectedCards = [];
    allCards = [];
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
