FROM ruby:3.2.8

# OSパッケージをまとめてインストール
RUN apt-get update -qq && \
  apt-get install -y --no-install-recommends \
  build-essential \
  libpq-dev \
  sqlite3 libsqlite3-dev \
  nodejs \
  yarn

# ホストと同じ UID/GID のユーザーを作成
ARG UID=1000
ARG GID=1000
RUN groupadd -g ${GID} codergroup \
  && useradd -m -u ${UID} -g codergroup coder

WORKDIR /app
# 以降は coder 権限で動く
USER coder

# Rails 7.0 系の最新パッチをインストール
RUN gem install rails -v '~> 7.0.0'

# Ruby起動時に logger を require する
ENV RUBYOPT="-r logger"

# Gemfile をコピーして、Gemfile.lock を生成
COPY ./backend/Gemfile /app/Gemfile
COPY ./backend/Gemfile.lock /app/Gemfile.lock
RUN bundle install --gemfile /app/Gemfile

