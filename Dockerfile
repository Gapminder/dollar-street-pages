FROM nginx

RUN apt-get update
RUN apt-get install -y python build-essential libssl-dev openssh-server curl  mc
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs
RUN npm i -g gulp
ENV CONSUMER_URL //prod-api-consumer.dollarstreet.org
RUN echo $CONSUMER_URL

ARG CONSUMER_URL
ENV CONSUMER_URL ${CONSUMER_URL}


RUN mkdir /home/ds-pages
WORKDIR /home/ds-pages
COPY ./ ./

COPY ./nginx_conf/default.conf /etc/nginx/conf.d/default.conf

RUN npm i

EXPOSE 80 443

RUN gulp env
RUN npm run build


