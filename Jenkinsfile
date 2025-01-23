pipeline {
    agent any
    environment {
        CACHE_DIR = 'node_modules'
        HORUSEC_INSTALL_SCRIPT = 'https://raw.githubusercontent.com/ZupIT/horusec/main/deployments/scripts/install.sh'
        PRIVATE_REGISTRY = '192.168.56.11:5000'
    }

    stages {
        stage('Setup') {
            agent {
                docker { 
                    image 'node:20.17.0'
                    args '-u root:root'
                }  
            }
            steps {
                sh '''
                    apt update
                    apt install -y jq sudo
                    curl -fsSL ${HORUSEC_INSTALL_SCRIPT} | bash -s latest
                '''
            }
        }
        stage('Building the system') {
            agent {
                docker { 
                    image 'node:20.17.0'
                    args '-u root:root'
                }  
            }
            steps {
                sh 'npm ci'
                sh 'export'
            }
        }
        stage('Tests') {
            parallel {
                stage('Static Analysis Test') {
                    agent {
                        docker {
                            image 'node:20.17.0'
                            args '-u root:root'
                        }
                    }
                    steps {
                        sh 'npm run lint'
                    }
                }

                stage('Security Test') {
                    agent {
                        docker {
                            image 'node:20.17.0'
                            args '-u root:root'
                        }
                    }
                    steps {
                        sh 'horusec start -p ./src -D || true'
                    }
                }

                stage('Code Coverage') {
                    agent {
                        docker {
                            image 'node:20.17.0'
                            args '-u root:root'
                        }
                    }
                    steps {
                        sh 'npm run test'
                    }
                }
            }
        }
        stage('Generate Release') {
            agent any
            when {
                expression {
                    return env.gitlabActionType == 'TAG_PUSH'
                }
            }
            steps {
                script {
                    env.GIT_TAG = env.gitlabBranch.replaceAll('refs/tags/', '')
                    sh "docker build -t ${PRIVATE_REGISTRY}/javascript-jenkins:${env.GIT_TAG} -f ./Dockerfile ."
                    // sh "docker build -t ${PRIVATE_REGISTRY}/javascript-jenkins:${env.BUILD_ID} -f ./Dockerfile ."
                }
            }
        }
        stage('Save Release in Container Registry') {
            agent any
            when {
                expression {
                    return env.gitlabActionType == 'TAG_PUSH'
                }
            }
            steps {
                script {
                    // Docker Login
                    withCredentials([usernamePassword(credentialsId: "privatehub", usernameVariable: "USER", passwordVariable: "PASS")]) {
                        sh "echo -n ${PASS} | docker login --username ${USER} --password-stdin http://${PRIVATE_REGISTRY}"
                    }
                    env.GIT_TAG = env.gitlabBranch.replaceAll('refs/tags/', '')
                    // Push Docker Image into Container Registry
                    sh "docker push ${PRIVATE_REGISTRY}/javascript-jenkins:${env.GIT_TAG}"
                    // sh "docker push ${PRIVATE_REGISTRY}/javascript-jenkins:${env.BUILD_ID}"
                }
            }
        }
    }
    post {
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline failed. Please check the logs.'
        }
        cleanup {
            echo 'Cleaning up Docker resources...'
            sh 'docker system prune -f || true'
        }
    }
}


