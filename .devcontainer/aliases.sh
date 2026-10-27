# 対話ターミナルのBashで使う
case $- in
  *i*) ;;
  *) return ;;
esac

alias gs='git switch'
alias gsc='git switch -c'
alias gsd='git switch develop'
alias pull='git pull --ff-only'
alias push='git push -u origin HEAD'

__takao_git_branch() {
  local branch
  branch=$(git symbolic-ref --quiet --short HEAD 2>/dev/null) \
    || branch=$(git rev-parse --short HEAD 2>/dev/null) \
    || return
  printf ' (%s)' "$branch"
}

PS1='\u@\h:\w$(__takao_git_branch)\$ '
