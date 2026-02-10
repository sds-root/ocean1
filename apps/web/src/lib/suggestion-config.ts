import type { SuggestionConfig } from '@/types/suggestion'

export const suggestionConfig: SuggestionConfig = {
  // ── 단일 리소스 ──
  resources: {
    ec2: [
      { id: 'ec2-status', label: '상태 확인', prompt: '{name}의 현재 상태를 알려줘' },
      { id: 'ec2-logs', label: '로그 보기', prompt: '{name}의 최근 로그를 보여줘' },
      { id: 'ec2-restart', label: '재시작', prompt: '{name}을 안전하게 재시작하려면 어떻게 해야 해?' },
      { id: 'ec2-metrics', label: '메트릭 보기', prompt: '{name}의 CPU와 메모리 메트릭을 보여줘' },
    ],
    rds: [
      { id: 'rds-status', label: '상태 확인', prompt: '{name} 데이터베이스의 현재 상태를 알려줘' },
      { id: 'rds-connections', label: '연결 확인', prompt: '{name}에 연결된 활성 커넥션을 보여줘' },
      { id: 'rds-backup', label: '백업 상태', prompt: '{name}의 마지막 백업은 언제야?' },
      { id: 'rds-scale', label: '스케일링', prompt: '{name}을 어떻게 스케일링할 수 있어?' },
    ],
    k8s: [
      { id: 'k8s-status', label: 'Pod 상태', prompt: '{name}의 현재 Pod 상태를 알려줘' },
      { id: 'k8s-logs', label: '로그 보기', prompt: '{name}의 컨테이너 로그를 보여줘' },
      { id: 'k8s-scale', label: '스케일링', prompt: '{name}의 레플리카를 어떻게 스케일할 수 있어?' },
      { id: 'k8s-describe', label: '상세 정보', prompt: '{name} Pod의 상세 정보와 이벤트를 보여줘' },
    ],
    s3: [
      { id: 's3-list', label: '객체 목록', prompt: '{name} 버킷의 최근 객체를 보여줘' },
      { id: 's3-size', label: '용량 확인', prompt: '{name} 버킷의 전체 용량은 얼마야?' },
      { id: 's3-permissions', label: '권한 확인', prompt: '{name}의 접근 권한을 확인해줘' },
    ],
  },

  // ── 같은 타입 리소스 복수 선택 ──
  multiResources: {
    ec2: [
      { id: 'multi-ec2-compare', label: '인스턴스 비교', prompt: '{names}의 상태와 메트릭을 비교해줘' },
      { id: 'multi-ec2-status', label: '전체 상태', prompt: '{names}의 현재 상태를 한눈에 보여줘' },
      { id: 'multi-ec2-health', label: '헬스체크', prompt: '{names}에 대해 헬스체크를 수행해줘' },
    ],
    rds: [
      { id: 'multi-rds-compare', label: 'DB 비교', prompt: '{names}의 데이터베이스 상태를 비교해줘' },
      { id: 'multi-rds-replication', label: '복제 상태', prompt: '{names} 간의 복제 상태를 확인해줘' },
      { id: 'multi-rds-performance', label: '성능 비교', prompt: '{names}의 성능 메트릭을 비교해줘' },
    ],
    k8s: [
      { id: 'multi-k8s-compare', label: 'Pod 비교', prompt: '{names}의 Pod 상태를 비교해줘' },
      { id: 'multi-k8s-status', label: '전체 상태', prompt: '{names}의 현재 상태를 요약해줘' },
      { id: 'multi-k8s-logs', label: '로그 비교', prompt: '{names}의 최근 로그를 비교해줘' },
    ],
    s3: [
      { id: 'multi-s3-compare', label: '버킷 비교', prompt: '{names} 버킷의 용량과 설정을 비교해줘' },
      { id: 'multi-s3-permissions', label: '권한 비교', prompt: '{names}의 접근 권한을 비교해줘' },
    ],
  },

  // ── 서로 다른 타입 리소스 복수 선택 ──
  mixedResources: [
    { id: 'mixed-overview', label: '전체 요약', prompt: '{names}의 현재 상태를 요약해줘' },
    { id: 'mixed-dependency', label: '의존성 분석', prompt: '{names} 간의 의존성 관계를 분석해줘' },
    { id: 'mixed-health', label: '종합 헬스체크', prompt: '{names}에 대해 종합 헬스체크를 해줘' },
  ],

  // ── 단일 티켓 ──
  tickets: {
    open: [
      { id: 'ticket-summarize', label: '요약하기', prompt: '티켓 {name}을 요약해줘' },
      { id: 'ticket-resources', label: '관련 리소스', prompt: '티켓 {name}과 관련된 리소스는 뭐가 있어?' },
      { id: 'ticket-assign', label: '담당자 제안', prompt: '티켓 {name}은 누구에게 할당하면 좋을까?' },
      { id: 'ticket-priority', label: '우선순위 평가', prompt: '티켓 {name}의 우선순위가 적절한지 평가해줘' },
    ],
    in_progress: [
      { id: 'ticket-progress', label: '진행 상황', prompt: '티켓 {name}의 현재 진행 상황은 어때?' },
      { id: 'ticket-blockers', label: '블로커 확인', prompt: '티켓 {name}에 블로커가 있어?' },
      { id: 'ticket-eta', label: '완료 예상', prompt: '티켓 {name}은 언제쯤 완료될 것 같아?' },
    ],
    resolved: [
      { id: 'ticket-summary', label: '해결 요약', prompt: '티켓 {name}이 어떻게 해결됐는지 요약해줘' },
      { id: 'ticket-verify', label: '수정 검증', prompt: '티켓 {name}의 수정 사항을 어떻게 검증할 수 있어?' },
    ],
  },

  // ── 티켓 복수 선택 ──
  multiTickets: [
    { id: 'multi-ticket-summary', label: '전체 요약', prompt: '티켓 {names}을 각각 요약해줘' },
    { id: 'multi-ticket-correlation', label: '연관성 분석', prompt: '티켓 {names} 사이에 연관성이 있는지 분석해줘' },
    { id: 'multi-ticket-priority', label: '우선순위 정리', prompt: '티켓 {names}의 우선순위를 비교하고 처리 순서를 제안해줘' },
  ],

  // ── 리소스 + 티켓 콤보 ──
  combo: [
    { id: 'combo-impact', label: '영향도 분석', prompt: '선택된 티켓이 해당 리소스({names})에 미치는 영향을 분석해줘' },
    { id: 'combo-relate', label: '연관성 확인', prompt: '선택된 리소스와 티켓({names}) 간의 연관성을 분석해줘' },
    { id: 'combo-action', label: '조치 방안', prompt: '선택된 티켓을 해결하기 위해 리소스({names})에 필요한 조치를 제안해줘' },
    { id: 'combo-timeline', label: '타임라인 정리', prompt: '선택된 리소스와 티켓({names})의 이벤트 타임라인을 정리해줘' },
  ],

  defaultResource: [
    { id: 'default-status', label: '상태 확인', prompt: '{name}의 상태를 알려줘' },
    { id: 'default-info', label: '정보 보기', prompt: '{name}에 대해 알려줘' },
  ],
  defaultTicket: [
    { id: 'default-summarize', label: '요약하기', prompt: '티켓 {name}을 요약해줘' },
  ],
}
