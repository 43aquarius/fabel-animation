#!/bin/bash
# 分块渲染 RedQueen（每块 900 帧），避免后台进程被清理的问题
# 用法: bash render-chunks-rq.sh <start_chunk> <end_chunk>   (含端点)
cd /home/z/my-project/remotion-video

TOTAL=7170
CHUNK=900
START_CHUNK=${1:-0}
END_CHUNK=${2:-7}
NCHUNKS=$(( (TOTAL + CHUNK - 1) / CHUNK ))

for i in $(seq $START_CHUNK $END_CHUNK); do
  [ $i -ge $NCHUNKS ] && break
  FROM=$(( i * CHUNK ))
  TO=$(( FROM + CHUNK - 1 ))
  [ $TO -ge $TOTAL ] && TO=$(( TOTAL - 1 ))
  OUT=$(printf "out/rq-part-%02d.mp4" $i)
  if [ -f "$OUT" ] && [ $(stat -c%s "$OUT") -gt 1000000 ]; then
    echo "[skip] chunk $i ($OUT exists)"
    continue
  fi
  echo "[render] chunk $i: frames $FROM-$TO"
  ./node_modules/.bin/remotion render RedQueen "$OUT" --frames=$FROM-$TO --log=error 2>&1 | grep -v "^stderr" | tail -2
  if [ -f "$OUT" ]; then
    echo "[done] chunk $i -> $OUT ($(du -h "$OUT" | cut -f1))"
  else
    echo "[FAIL] chunk $i"
    exit 1
  fi
done
echo "chunks $START_CHUNK..$END_CHUNK complete"
