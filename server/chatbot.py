import re, string, unicodedata,time,datetime,csv,random,json,nltk
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity, linear_kernel

THRESHOLD=0.4
wpt = nltk.WordPunctTokenizer()
turkish_stop_words = nltk.corpus.stopwords.words('turkish')

with open('data.json', encoding='utf-8-sig') as jsonFile:
    question_answers = json.load(jsonFile)

def clean_text(sentence):
    abbrs=question_answers['abbrs']
    special_chars=question_answers['turkish_special_chars']
    
    for special_char in special_chars:
        
        sentence=sentence.replace(special_char[0],special_char[1])
    
    for abbr in abbrs:
        sentence=sentence.replace(abbr[0],abbr[1])

    sentence = re.sub(" \d+", " ", sentence)
    pattern = r"[{}]".format(",.;") 
    sentence = re.sub(pattern, "", sentence).lower().strip()
    tokens = wpt.tokenize(sentence)
    new_tokens = [token for token in tokens if token not in turkish_stop_words]
    
    sentence = ' '.join(new_tokens)
    return sentence

def calculate_similarity(question1,question2):
    sentences=[clean_text(question1),clean_text(question2)]
    tfidfVec = TfidfVectorizer()
    tfidf = tfidfVec.fit_transform(sentences)
   
    scores = cosine_similarity(tfidf[-1], tfidf)
   
    idx=scores.argsort()[0][-2]
    flat = scores.flatten()
    flat.sort()
    return flat[-2]

def chatbot_answer(question):
    
    maxScore=selectedIndex=index=0
    questionClean=clean_text(question)
    for qa in question_answers['questions_and_answers']:
        for q in qa['questions']:
            score=calculate_similarity(questionClean,clean_text(q))
            if score>THRESHOLD and score>0:
                maxScore=score
                selectedIndex=index 
        
        index=index+1
    
    if maxScore<THRESHOLD:
        returnAnswer=random.choice(question_answers['default_answers'])
    else:
    
        returnAnswer=random.choice(question_answers['questions_and_answers'][selectedIndex]['answers'])
    
    csvLogdata = [datetime.datetime.now(), question, returnAnswer['text']]

    with open('chatbotlog.csv', 'a', encoding='UTF8') as f:
        writer = csv.writer(f,delimiter ='|')
        writer.writerow(csvLogdata)
    
    return returnAnswer
