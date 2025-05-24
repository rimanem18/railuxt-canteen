FROM ruby:3.2.8

# OSパッケージをまとめてインストール
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
      build-essential \
      libpq-dev \
      sqlite3 libsqlite3-dev \
      nodejs \
      yarn

WORKDIR /app

# Rails 7.0 系の最新パッチをインストール
RUN gem install rails -v '~> 7.0.0'

# Ruby起動時に logger を require する
ENV RUBYOPT="-r logger"

# Gemfile をコピーして、Gemfile.lock を生成
COPY ./backend/Gemfile /app/Gemfile
COPY ./backend/Gemfile.lock /app/Gemfile.lock
RUN bundle install --gemfile /app/Gemfile

CMD ["bash", "rm -f tmp/pids/server.pid && bin/rails server -b 0.0.0.0 -p 3000"]
