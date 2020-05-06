awk -F'\t' -v OFS=',' '
  NR == 1 {print "id", $0; next}
  {print (NR-1), $0}
' catalog.csv > catalog3.csv
