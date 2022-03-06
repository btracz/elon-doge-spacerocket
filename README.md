# Features

1. Listens to Elon Musk's tweets
2. Analyzes content to find topic
3. Sends mail alert if tweet is about Cryptos or Dogecoin
4. [TODO] Watches price of dogecoin
5. [TODO] Buy with leverage if it rises (>0.5% since tweet)

TODO : Unit testing + simulation mode

# Future enhancements

- Evaluate sentiment

# Strategy

## Leverage Isolated x50 (objective 10x profit)

### Invest N $ à price X

**Orders:**

- #A [BUY] {MARKET}
- #B [SELL] {LIMIT} (STOP LOSS) -1%
- #C [SELL] {LIMIT} (TAKE PROFIT) X+20% close (profit 10N $) => FAIL-SAFE order in case of bug, else it will be ajusted

---

### DOWN (X -1%) :

- #B Executed (STOP LOSS) => -50% profit ! |END|

### **OR**

### UP (X +5%) :

**New orders:**

- #D REPLACE #B [SELL] {LIMIT} (STOP LOSS) 0% (entry price)
- #E NEW [SELL] {LIMIT} (TAKE PROFIT) X+15% N/2 $ (5.88% of position)

**Open orders:** #D #C #E

---

### DOWN (X +0%) :

- #D Executed (STOP LOSS) => 0% profit ! |END|

### **OR**

### UP (X +15% = Y) :

- #E Executed (TAKE PROFIT) => 50% of initial investment secured

**New orders:**

- #F REPLACE #D [SELL] {LIMIT} (STOP LOSS) Y -10%
- #G REPLACE #C [SELL] {LIMIT} (TAKE PROFIT) +35% close (profit ??? $) => FAIL-SAFE
- #H NEW [SELL] {LIMIT} (TAKE PROFIT) X+30% 5N $ (33% of position)

**Open orders:** #F #G #H

---

### DOWN (Y -10%) :

- #F Executed (STOP LOSS) => +50% profit ! |END|

### **OR**

### UP (X +30% = Z)

- #H Executed (TAKE PROFIT) => +450% (5.5x) of initial investment secured

**New orders:**

- #I REPLACE #F [SELL] {LIMIT} (STOP LOSS) Z -10%
- REMOVE #G => NO MORE FAIL-SAFE, manual
- #J NEW [SELL] {LIMIT} (TAKE PROFIT) X+50% 10N $ (61% of position)

## **Open orders:** #I #J

### DOWN (Z -10%) :

- #I Executed (STOP LOSS) => +981% (>10x) profit ! |END|

### **OR**

### UP (X +50% = §)

- #J Executed (TAKE PROFIT) => +1450% (15.5x) of initial investment secured

**New orders:**

- #K REPLACE #K [SELL] {LIMIT} (STOP LOSS) § -10%

**Open orders:** #K

---

### DOWN (§ -10%) :

- #K Executed (STOP LOSS) => +2310% (>20x) profit ! |END|

### **OR**

### UP TO THE MOON

## Second tweet

SNOOZE 1 week ?
Same strategy with last gain 20N $ (max $50 000)
