# hermes

# hermes

KURULUM:
1) Python3 developer kütüphaneleri kurulmalı

   sudo apt-get install python3 python-dev python3-dev \
     build-essential libssl-dev libffi-dev \
     libxml2-dev libxslt1-dev zlib1g-dev \

2) Apache kurulmalı
   
    sudo apt install apache2

3) Apache için mod_wsgi kurulmalı
    
    sudo apt install libapache2-mod-wsgi-py3

4) pip3 kurulmalı
   
    sudo apt install python3-pip

5) Git kurulmalı
   
    sudo apt install git

6) Flask ve gerekli eklentiler kurulmalı
    
    pip3 install flask
    pip3 install setuptools
    pip3 install wheel
    pip3 install requests
    pip3 install flask-jwt-extended
    pip3 install flask-cors
    pip3 install gunicorn

7) Git ile kaynak kod klonlanmalı

8) System Servisi oluşturulmalı ve çalıştırılmalı
    8.1  Kaynak kodda yer alan "hermes.service" dosyasını /etc/systemd/system/ konumuna koy
    8.2  Servis çalıştırılmalı

        sudo systemctl start hermes.service
        sudo systemctl enable hermes.service

    8.3 Durumu aşağıdaki komutla görülebilir
        sudo systemctl status flaskrest.service

9) Apache sunucusu Proxy olarak kullanılmalı gelen istekler servise yönlendirilmeli
    Not: Apache yerine nginx de kullanılabilir 
    9.1 Apache default web sitesinin conf dosyası aşağıdaki gibi olmalı
    
            <VirtualHost *:80>
	            ServerAdmin root@ubuntu

	            ErrorLog ${APACHE_LOG_DIR}/hermes-error.log
                CustomLog ${APACHE_LOG_DIR}/hermes-access.log combined

                <Location />
                    ProxyPass unix:/home/hermes/hermes.sock|http://127.0.0.1/
                    ProxyPassReverse unix:/home/hermes/hermes.sock|http://127.0.0.1/
                </Location>
            </VirtualHost>
    
    9.2 Apache servisi yeniden başlatılmalı

        sudo service apache2 restart


NOTLAR:

Bazı durumlarda hata veriyor ve aşağıdaki kodla spacy kurmak gerekebiliyor

    python3 -m spacy download en

Yazılımda güncelleme olduğunda servis yeniden başlatılmalı
    
    systemctl restart hermes

python3 -m spacy download en
https://medium.com/@thishantha17/build-a-simple-python-rest-api-with-apache2-gunicorn-and-flask-on-ubuntu-18-04-c9d47639139b
