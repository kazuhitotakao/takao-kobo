FROM node:24-bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       git bash less ca-certificates curl \
    && rm -rf /var/lib/apt/lists/*

# GitHub CLIの公式Debianリポジトリを登録してインストール
RUN install -m 0755 -d /etc/apt/keyrings \
    && curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \
       -o /etc/apt/keyrings/githubcli-archive-keyring.gpg \
    && chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
    && printf '%s\n' \
       "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
       > /etc/apt/sources.list.d/github-cli.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends gh \
    && rm -rf /var/lib/apt/lists/*

# Codex CLI。プロジェクトの依存関係とは分けてインストール
RUN npm install --global @openai/codex

# Claude Code CLI。公式のネイティブインストーラーを使用
RUN curl -fsSL https://claude.ai/install.sh -o /tmp/claude-install.sh \
    && bash /tmp/claude-install.sh \
    && rm /tmp/claude-install.sh

RUN mkdir -p /root/.codex \
    && printf '%s\n' 'cli_auth_credentials_store = "file"' > /root/.codex/config.toml

ENV PATH="/root/.local/bin:${PATH}"

# Bashを開くたびにプロジェクトの短縮コマンドを読み込む
RUN printf '%s\n' \
    '[ -f /app/.devcontainer/aliases.sh ] && . /app/.devcontainer/aliases.sh' \
    >> /root/.bashrc

WORKDIR /app

EXPOSE 3000
