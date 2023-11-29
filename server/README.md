# Installing Hermes to Linux Server

Step 1: Install Python3 developer libraries

    sudo apt-get install python3 python-dev python3-dev build-essential libssl-dev libffi-dev libxml2-dev libxslt1-dev zlib1g-dev

Step 2: Install Apache Web Server
   
    sudo apt install apache2

Step 3: Install mod_wsgi for Apache
    
    sudo apt install libapache2-mod-wsgi-py3

Step 4: Install pip3 
   
    sudo apt install python3-pip

Step 5: Install Git
   
    sudo apt install git

Step 6: Install Flask and extensions
    
    pip3 install flask
    pip3 install setuptools
    pip3 install wheel
    pip3 install requests
    pip3 install flask-jwt-extended
    pip3 install flask-cors
    pip3 install gunicorn

Step 7:  Clone the source code using Git 

Step 8:  Create Linux System Service and run

    8.1  Copy to "hermes.service" file in the source code to /etc/systemd/system/
    8.2  Run Service

	        sudo systemctl start hermes.service
	        sudo systemctl enable hermes.service

    8.3 Service status can be track the following command.
        sudo systemctl status flaskrest.service

9) Apache server should be used as a proxy and incoming requests should be directed to the service.
   Note: Nginx can also be used instead of Apache
    9.1 The conf file of the Apache default website should be as follows
    
            <VirtualHost *:80>
	            ServerAdmin root@ubuntu

	            ErrorLog ${APACHE_LOG_DIR}/hermes-error.log
                CustomLog ${APACHE_LOG_DIR}/hermes-access.log combined

                <Location />
                    ProxyPass unix:/home/hermes/hermes.sock|http://127.0.0.1/
                    ProxyPassReverse unix:/home/hermes/hermes.sock|http://127.0.0.1/
                </Location>
            </VirtualHost>
    
    9.2  Restart Apache service

        sudo service apache2 restart


NOTES:

The service must be restarted when there is an update to the software
    
    systemctl restart hermes

