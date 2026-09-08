# AWS 환경 Slack Notification 시스템 (Node.js)

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **프로젝트명** | AWS 환경 Slack Notification 시스템 |
| **수행 기간** | 2023.04 ~ 2022.06 (이미지 기준) |
| **참여 인원** | 1명 |
| **주요 기술** | AWS (EventBridge, SNS, Lambda), Node.js, Terraform, GitLab CI/CD |
| **저장소** | [https://gitlab.com/whdals5049/slack_notification_for_aws](https://gitlab.com/whdals5049/slack_notification_for_aws) |

본 프로젝트는 AWS 콘솔 및 리소스에서 발생하는 주요 변경 이벤트(IAM, EC2, Console Login 등)를 실시간으로 감지하여 Slack 채널로 알림을 전송하는 시스템을 구축한 사례입니다.  
Terraform을 활용하여 인프라를 모듈화하고, GitLab CI/CD를 통해 자동화된 배포 파이프라인을 구성하여 재사용성과 운영 효율성을 높였습니다.

### 주요 성과
- AWS 환경에서 리소스 변경을 실시간 감지
- SNS와 Lambda를 공통으로 사용하여 비용 약 12% 절감
- 해당 서비스를 Terraform으로 모듈화하여 구축 (재사용 용이)
- GitLab을 활용한 CI/CD 파이프라인 구축

---

## 2. 시스템 아키텍처

전체 흐름은 다음과 같습니다.

```
AWS CloudTrail / API 호출
        ↓
Amazon EventBridge (이벤트 규칙 필터링)
        ↓
Amazon SNS (토픽)
        ↓
AWS Lambda (Node.js 함수)
        ↓
Slack Incoming Webhook
```

- **EventBridge**: IAM, EC2, Sign-in 관련 특정 이벤트만 필터링하여 SNS로 전달
- **SNS**: 이벤트를 구독자(Lambda)에게 팬아웃
- **Lambda**: 이벤트 내용을 파싱하고 색상·메시지 포맷을 결정한 뒤 Slack으로 전송
- **Slack**: 첨부 메시지(Attachment) 형태로 상세 정보를 표시하며, CloudTrail 콘솔 바로가기 버튼 제공

환경별로 리전을 분리하여 운영합니다.
- **dev**: `us-east-1`
- **prod**: `ap-northeast-2`

---

## 3. 핵심 기능 상세 설명

### 3.1 이벤트 감지 및 필터링 (EventBridge)

EventBridge Rule은 다음 소스와 이벤트 이름을 대상으로 합니다.

**모니터링 대상 서비스**
- `aws.iam` / `iam.amazonaws.com`
- `aws.ec2` / `ec2.amazonaws.com`
- `aws.signin` / `signin.amazonaws.com`

**주요 감지 이벤트 예시**
- IAM: `Attach*Policy`, `CreateUser`, `DeleteUser`, `CreateAccessKey`, `ChangePassword`, `Detach*Policy` 등
- EC2: `RunInstances`, `StartInstances`, `StopInstances`, `TerminateInstances`, Security Group 인바운드/아웃바운드 규칙 변경
- Sign-in: `ConsoleLogin`

EventBridge는 해당 패턴에 일치하는 이벤트만 SNS Topic으로 전달하여 불필요한 알림을 최소화합니다.

### 3.2 알림 전송 로직 (Lambda – Node.js)

Lambda 함수(`app.js`)는 SNS로부터 전달받은 CloudTrail 이벤트를 파싱하여 Slack 메시지를 구성합니다.

#### 주요 처리 로직
1. SNS 레코드에서 실제 이벤트(`detail`) 추출
2. 사용자 정보, 이벤트 시간, 이벤트 이름, 소스 IP, 리전 등 핵심 필드 추출
3. 이벤트 유형에 따라 **메시지 색상**과 **fallback 텍스트** 결정
4. Slack Block Kit 기반 첨부 메시지 생성
5. CloudTrail 이벤트 상세 페이지로 이동하는 버튼 포함
6. HTTPS를 통해 Slack Incoming Webhook으로 POST

#### 색상 규칙 (우선순위 높음 순)
| 조건 | 색상 | 의미 |
|------|------|------|
| Root 사용자 | Black (`#000000`) | 최고 권한 계정 활동 |
| IAM Delete / Detach / Revoke 계열 | Red (`#ff000f`) | 위험 변경 |
| IAM 생성/연결 계열 | Green (`#00ff0f`) | 일반 변경 |
| Console Login | Blue (`#0000ff`) | 로그인 감지 |
| EC2 Stop / Terminate | Red | 위험 변경 |
| EC2 기타 | Green | 일반 변경 |
| 그 외 | Magenta (`#ff00ff`) | 기타 |

메시지에는 다음 정보가 포함됩니다.
- 사용자 유형 및 사용자명
- 접속 리전
- 발생 시간
- 이벤트 이름 / 소스
- 소스 IP (IP 위치 조회 링크 포함)
- CloudTrail 콘솔 바로가기 버튼

### 3.3 인프라 모듈화 (Terraform)

Terraform 코드를 환경과 모듈로 명확히 분리하여 재사용성과 유지보수성을 확보하였습니다.

```
terraform/
├── env/
│   ├── dev/provisioning/     # us-east-1
│   └── prod/provisioning/    # ap-northeast-2
└── modules/
    ├── eventbridge/
    ├── sns/
    └── lambda/
```

#### 모듈 구성
- **SNS 모듈**: Topic 생성 + EventBridge 및 기본 계정 소유자 권한 정책
- **Lambda 모듈**: IAM Role, 실행 권한, SNS 구독 권한, 함수 배포, CloudWatch Logs 설정
- **EventBridge 모듈**: Rule + SNS Target 설정

각 환경의 `main.tf`에서 세 모듈을 호출하고, SNS Topic과 Lambda 간 구독을 연결합니다.

#### 주요 변수
- `environment`: 환경 이름 (dev / prod)
- `slack_channel`: 알림 수신 채널 (기본값 `#devops`)
- `slack_webhook_url`: Slack Incoming Webhook URL (sensitive)

### 3.4 CI/CD 파이프라인 (GitLab CI)

`.gitlab-ci.yml`을 통해 완전 자동화된 Terraform 파이프라인을 구성하였습니다.

#### 파이프라인 단계
1. **validate**: `terraform fmt -check` + `validate`
2. **plan**: 변경된 환경에 대해서만 plan 수행 후 artifact 저장
3. **deploy**: 기본 브랜치에서 plan artifact를 사용하여 apply
4. **cleanup**: 수동 destroy 작업 (dev / prod 각각)

#### 주요 특징
- GitLab Managed Terraform State (HTTP Backend) 사용
- 환경별 독립적인 state (`dev`, `prod`)
- 변경된 경로에만 해당하는 job 실행 (rules: changes)
- `resource_group`을 활용한 동시성 제어
- Plan artifact는 Developer 권한으로 제한하고 1시간 후 만료
- `SLACK_WEBHOOK_URL`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` 등은 CI/CD Variables로 관리 (masked / protected)

#### 필요한 CI/CD Variables
- `AWS_ACCESS_KEY_ID` (masked, protected)
- `AWS_SECRET_ACCESS_KEY` (masked, protected)
- `SLACK_WEBHOOK_URL` (masked, hidden, protected)
- `SLACK_CHANNEL` (optional, 기본값 `#devops`)

---

## 4. 기술 스택 및 설계 포인트

| 구분 | 기술 / 도구 | 역할 |
|------|-------------|------|
| 인프라 | Terraform 1.5+ / AWS Provider 5.x | IaC 및 모듈화 |
| 컴퓨팅 | AWS Lambda (Node.js 22.x) | 이벤트 처리 및 Slack 전송 |
| 메시징 | Amazon SNS | 이벤트 중개 |
| 이벤트 | Amazon EventBridge | 패턴 기반 필터링 |
| CI/CD | GitLab CI | 검증 → 계획 → 배포 자동화 |
| 알림 | Slack Incoming Webhook + Block Kit | 구조화된 알림 |

### 설계상 고려 사항
- **비용 효율**: EventBridge → SNS → Lambda 구조를 공통으로 사용하여 중복 리소스 최소화 (약 12% 비용 절감 효과)
- **보안**: Webhook URL과 AWS 자격 증명은 CI/CD Variables로만 관리하고 코드에 포함하지 않음
- **가시성**: Slack 메시지에 CloudTrail 직접 링크와 IP 위치 조회 링크를 제공하여 빠른 확인 가능
- **재사용성**: 모듈 단위로 분리하여 다른 프로젝트에서도 동일 패턴을 쉽게 적용 가능
- **운영 안정성**: 환경별 독립 state와 resource_group으로 충돌 방지

---

## 5. 프로젝트 구조 요약

```
.
├── .gitlab-ci.yml                 # CI/CD 파이프라인 정의
├── .gitignore
├── README.md
└── terraform/
    ├── env/
    │   ├── dev/provisioning/      # dev 환경 (us-east-1)
    │   └── prod/provisioning/     # prod 환경 (ap-northeast-2)
    └── modules/
        ├── eventbridge/           # EventBridge Rule + Target
        ├── sns/                   # SNS Topic + Policy
        └── lambda/                # Lambda 함수 + IAM Role
            ├── app.js             # 핵심 비즈니스 로직
            └── app.zip
```

---

## 6. 결론 및 의의

본 프로젝트는 AWS 환경에서 발생하는 중요한 보안·운영 이벤트를 실시간으로 Slack에 전달하는 경량 모니터링 시스템을 성공적으로 구축한 사례입니다.  

특히 Terraform 모듈화와 GitLab CI/CD를 결합함으로써 **인프라의 재사용성**과 **배포 과정의 자동화**를 동시에 달성하였으며, SNS와 Lambda를 공통으로 활용하여 비용 효율성까지 고려한 점이 특징입니다.

단일 인원으로 설계부터 구현, 파이프라인 구축까지 완료하였으며, 실제 운영 환경(dev/prod)에 적용 가능한 수준의 완성도를 갖추고 있습니다.

---

*이 문서는 프로젝트 소스 코드 및 발표 자료를 기반으로 작성되었습니다.*
