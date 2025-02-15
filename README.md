# AFCON Challenge

## Problem Statement

Egypt national football team is getting ready to face Uganda next Sunday. Players are exerting much effort in the training to do their best in the following match. Coaches follow a weird strategy to choose the man of AFCON (Africa Cup of Nations). Let's call a player, whose total number of scored goals is a prime number, a PRIMO. The coaches will choose the highest PRIMO player to be the man of AFCON.

You are given **N** (the number of matches played) followed by N match description, Each description starts with **M** (the number of players who scored at the match) followed by M lines. Each line consists of the name of a player and **S** (the number of goals scored by the player), space-separated. Then you will be asked **K** queries. Each query(line) consists of the name of a player. For each query you have to calculate the minimum number of goals the player needs to score in the next match to be the man of the AFCON.

The players are busy training. We heard that you are a clever developer so we are challenging you to help the Egyptian players to know the minimum number of goals each player needs to score to be the man of AFCON.

## Input

Variable | Description
--- | ---
(1 ≤ N ≤ 100) | The number of matches played.  
(1 ≤ M ≤ 23) | The number of players who scored at the match.  
(1 ≤ S ≤ 10) | The number of goals scored by a player at the match.  
(1 ≤ K ≤ 15) | The number of queries.

## Output

The output should consist of **K** lines. Each line consists of the number of goals the player needs to score in the next match to be the man of AFCON.

### Example

#### Input

```text
3
2
Salah 2
Trezeguet 4
3
Elmohamady 3
AmrWarda 1
Hegazi 2
2
MarawanMohsen 1
Salah 3
3
Trezeguet
Salah
Elmohamady
```

#### Output

```text
3
0
4
```
