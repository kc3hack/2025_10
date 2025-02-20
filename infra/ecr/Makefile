# ECR


# ECR URLの定義
FRONT_ECR_URL := $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/$(FRONT_IMAGE_NAME)
BACK_ECR_URL := $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/$(BACK_IMAGE_NAME)
UUID := $(shell uuidgen)

login-ecr:
	aws ecr get-login-password --region $(AWS_REGION) | docker login --username AWS --password-stdin $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com

build-ecr-front: 
	docker build --platform linux/amd64 -t $(FRONT_IMAGE_NAME) -f ./frontend/Dockerfile ./frontend

build-ecr-back: 
	docker build --platform linux/amd64 -t $(BACK_IMAGE_NAME) -f ./backend/Dockerfile ./backend

tag-ecr: build-ecr-front build-ecr-back
	docker tag $(FRONT_IMAGE_NAME):$(TAG) $(FRONT_ECR_URL):$(TAG)
	docker tag $(BACK_IMAGE_NAME):$(TAG) $(BACK_ECR_URL):$(TAG)

push-ecr: tag-ecr
	docker push $(FRONT_ECR_URL):$(TAG)
	docker push $(BACK_ECR_URL):$(TAG)

tag-ecr-uuid: build-ecr-front build-ecr-back
	docker tag $(FRONT_IMAGE_NAME):$(TAG) $(FRONT_ECR_URL):$(UUID)
	docker tag $(BACK_IMAGE_NAME):$(TAG) $(BACK_ECR_URL):$(UUID)

push-ecr-uuid: tag-ecr-uuid
	docker push $(FRONT_ECR_URL):$(UUID)
	docker push $(BACK_ECR_URL):$(UUID)

ecr: login-ecr build-ecr-front build-ecr-back tag-ecr tag-ecr-uuid push-ecr push-ecr-uuid