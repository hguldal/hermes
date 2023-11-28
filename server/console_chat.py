from chatbot import chatbot_answer
devam=True
while devam:
    question=input('Me>')
    if question=='exit':
        print('bye')
        devam=False
    else: 
        print('ChatBot>'  + chatbot_answer(question)['text'])