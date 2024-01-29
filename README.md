# PANAX-homework-assignment


# Steps to run: 
1) enter root dir
2) docker compose up dev-db -d
3) npm i
4) npm run start-dev


# Assumptions
1) CSV file may contain millions of records, using stream to process records row by row
2) If a transaction does not contain a reference number it will not be unique
3) Update route returns all processed records whether they are added or only updated
4) Updated rows only if reference number already exists, otherwise added as new row
