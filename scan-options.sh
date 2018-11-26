#!/bin/sh
# @since 2018.11.26, 22:45
# @version 2018.11.27, 00:26
# @description list options

DATE=`date "+%Y.%m.%d %H:%M:%S"`

TEMPFILE=".temp"
INSERTTO="README.md"

cat "index.js" | sed " \
  :a;N;\$!ba;s/ *\n/<BR>/g; \
  s/^.*\/\*{{{ Propeties\.\.\. \*\/ *<BR>//;
  s/ *\/\* \.\.\.Properties }}}\*\/.*$//;
  s/ *\/\*\* */\n/g;
  s/[\ \t]\+/ /g; \
  s/^\( *<BR> *\)\+//; \
  s/\( *<BR> *\)\+$//; \
  " > $TEMPFILE
LIST=`cat $TEMPFILE | sed 's/[\ \t\n]/<_>/g'`

echo "<!-- generated via \`scan-options.sh\` at $DATE -->" > $TEMPFILE
for S in $LIST; do
  echo "$S" | sed "\
    s/<_>/ /g; \
    s/\(<BR> \+\* \+\|<BR>\) */ /g; \
    s/^ *\(.*\) \+\*\/ \+\(\w\+\): \+\(.*\), *$/- **\2**: \1 (default: \`\3\`)/g; \
    " >> $TEMPFILE
done
echo "" >> $TEMPFILE

RESULT=`cat $TEMPFILE`

PART1=`cat $INSERTTO | tr '\n' '\f' | sed "s/^\(.*<!-- options begin -->\).*$/\1/" | tr '\f' '\n'`
PART2=`cat $INSERTTO | tr '\n' '\f' | sed "s/^.*\(<!-- options end -->.*\)$/\1/" | tr '\f' '\n'`

echo "$PART1" > $INSERTTO
echo "$RESULT" >> $INSERTTO
echo "$PART2" >> $INSERTTO

rm -f $TEMPFILE
