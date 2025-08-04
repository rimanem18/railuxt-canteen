# railuxt-canteen

## 動作確認済み環境

- Docker version 28.1.1
- Docker Compose version v2.35.1
- node, npm, ruby,bundler などをホストにインストールする必要はなく、コンテナ内で完結しています。

### format / lint

frontend は eslint。backend は rubocop。

eslint に関してはコンテナに依存せずに実施されています。
rubocop に関しては、コンテナ起動時、 docker compose コマンドを経由して実行しています。

dev container の用意などをせず、最悪 vscode とか関係なく動かせるようにするためです。実際の vscode での開発では、拡張機能の「Run on Save」を利用し、docker compose を毎回経由させています。

## 動かすには

コンテナ起動後、 http://localhost:3000 にアクセスすると、注文画面が表示されます。

<img width="1073" height="368" alt="Screenshot from 2025-08-04 23-07-14" src="https://github.com/user-attachments/assets/4d5733fe-920a-44e4-87ed-a5997d539e56" />

### 初回

```sh
make init
```

### 毎回

コンテナ起動

```sh
make up
```

### コンテナ終了

```sh
make down
```

## 操作方法
<img width="623" height="592" alt="Screenshot from 2025-08-04 23-10-21" src="https://github.com/user-attachments/assets/e71a535e-40cb-4a1f-a971-604875a1fc17" />

「注文する」を押下すると、アラートが表示されて注文できます。

http://localhost:3000/orders に遷移すると、発注済みの注文がリストで表示されます。
「提供済みにする」を押下すると、提供済みフラグが立ちます。


