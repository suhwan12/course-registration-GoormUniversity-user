pipeline{
    agent{
        kubernetes{
yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: gradle
    image: gradle:8.0.2-jdk11
    command: ['sleep']
    args: ['infinity']
  - name: kaniko
    image: gcr.io/kaniko-project/executor:debug
    command: ['sleep']
    args: ['infinity']
    volumeMounts:
    - name: registry-credentials
      mountPath: /kaniko/.docker
  volumes: 
  - name: registry-credentials
    secret:
      secretName: regcred  
      items:
      - key: .dockerconfigjson
        path: config.json
'''
      }
    }

    stages{
        stage('checkout'){
          steps{
            container('gradle'){
              git branch: 'main', url: 'https://github.com/suhwan12/course-registration-GoormUniversity-user.git'
              } 
            }
        }
        stage('npm install & npm Build & Docker Build & Tag Docker image'){
          steps{
            container('kaniko'){
                    sh "executor --dockerfile=Dockerfile \
                    --context=dir://${env.WORKSPACE} \
                    --destination=suhwan11/frontend-user:latest \
                    --destination=suhwan11/frontend-user:${env.BUILD_NUMBER}"
                }
            }
        }
        stage('Update K8s to New Frontend Deployment'){
          steps{
            container('gradle'){
                git branch: 'main' , url:'https://github.com/suhwan12/finalproject-argocd.git'
                sh 'sed -i "s/image:.*/image: suhwan11\\/frontend-user:${BUILD_NUMBER}/g" front-deployment-user.yaml'
                sh 'git config --global user.name suhwan12'
                sh 'git config --global user.email xman0120@naver.com'
                sh 'git config --global --add safe.directory /home/jenkins/agent/workspace/Frontend-Pipeline-User'
                sh 'git add front-deployment-user.yaml'
                sh 'git commit -m "Jenkins Build Number - ${BUILD_NUMBER}"'
                withCredentials([gitUsernamePassword(credentialsId: 'github-credentials', gitToolName: 'Default')]) {
                    sh 'git push origin main'
                }
            }
          }
        }
    }
}
