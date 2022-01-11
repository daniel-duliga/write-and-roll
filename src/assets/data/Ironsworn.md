![](https://i.imgur.com/P4BvfKD.png)
https://www.ironswornrpg.com/

*A Tabletop RPG of Perilous Quests for Solo, Co-OP and Guided Play*

# 🥷 Character

Roll on the following table, and assign the +3 value to the result. Then, distribute the remaining stats (+2, +2, +1, +1) as you like.

``` table Character Stats
1-20,"You are nimble, fast, and precise: Edge"
21-40,"You are willful, courageous, and sociable: Heart"
41-60,"You are strong, forceful, and imposing: Iron"
61-80,"You cunning, deceptive, and sneaky: Shadow"
81-00,"You are smart, knowledgeable, and resourceful: Wits"
```

# ⚔️ Moves
## Action Roll

Roll your action die (d6) and challenge dice (2d10). The total of your
action die, your stat, and any adds is your action score. Your action score is never greater than 10—anything over that is ignored.

- Strong hit = Action score is greater than both of the challenge dice
- Weak Hit = Action score is greater than one of the challenge dice
- Miss = Action score is not greater than either of the challenge dice

``` action Action Roll
const modifier = await api.prompt('Modifier');
let action = api.rollDice('1d6') + +modifier;
if (action > 10) {
  action = 10;
}
const challenge1 = api.rollDice('1d10');
const challenge2 = api.rollDice('1d10');

const strongHit = action > challenge1 && action > challenge2;
const miss = action < challenge1 && action < challenge2;
const opportunityOrComplication = challenge1 === challenge2;

let result = '';

if (strongHit) {
  result = result.concat('Strong Hit!');
  if (opportunityOrComplication) {
    result = result.concat(' Opportunity!');
  }
} else if (miss) {
  result = result.concat('Miss!');
  if (opportunityOrComplication) {
    result = result.concat(' Complication!');
  }
} else {// weak hit
  result = result.concat('Weak Hit!');
}

result = result.concat(` (${action} vs. ${challenge1}, ${challenge2})`);

return result;
```

# 🎲 Oracles
## Fate
``` table Fate: 50/50
1-50,No
51-100,Yes
```
``` table Fate: Almost Certain
1-10,No
11-100,Yes
```
``` table Fate: Likely
1-25,No
26-100,Yes
```
``` table Fate: Small Chance
1-90,No
91-100,Yes
```
``` table Fate: Unlikely
1-75,No
76-100,Yes
```
## Action & Theme
``` table Action
1,Scheme
2,Clash
3,Weaken
4,Initiate
5,Create
6,Swear
7,Avenge
8,Guard
9,Defeat
10,Control
11,Break
12,Risk
13,Surrender
14,Inspect
15,Raid
16,Evade
17,Assault
18,Deflect
19,Threaten
20,Attack
21,Leave
22,Preserve
23,Manipulate
24,Remove
25,Eliminate
26,Withdraw
27,Abandon
28,Investigate
29,Hold
30,Focus
31,Uncover
32,Breach
33,Aid
34,Uphold
35,Falter
36,Suppress
37,Hunt
38,Share
39,Destroy
40,Avoid
41,Reject
42,Demand
43,Explore
44,Bolster
45,Seize
46,Mourn
47,Reveal
48,Gather
49,Defy
50,Transform
51,Persevere
52,Serve
53,Begin
54,Move
55,Coordinate
56,Resist
57,Await
58,Impress
59,Take
60,Oppose
61,Capture
62,Overwhelm
63,Challenge
64,Acquire
65,Protect
66,Finish
67,Strengthen
68,Restore
69,Advance
70,Command
71,Refuse
72,Find
73,Deliver
74,Hide
75,Fortify
76,Betray
77,Secure
78,Arrive
79,Affect
80,Change
81,Defend
82,Debate
83,Support
84,Follow
85,Construct
86,Locate
87,Endure
88,Release
89,Lose
90,Reduce
91,Escalate
92,Distract
93,Journey
94,Escort
95,Learn
96,Communicate
97,Depart
98,Search
99,Charge
00,Summon
```
``` table Theme
1,Risk
2,Ability
3,Price
4,Ally
5,Battle
6,Safety
7,Survival
8,Weapon
9,Wound
10,Shelter
11,Leader
12,Fear
13,Time
14,Duty
15,Secret
16,Innocence
17,Renown
18,Direction
19,Death
20,Honor
21,Labor
22,Solution
23,Tool
24,Balance
25,Love
26,Barrier
27,Creation
28,Decay
29,Trade
30,Bond
31,Hope
32,Superstition
33,Peace
34,Deception
35,History
36,World
37,Vow
38,Protection
39,Nature
40,Opinion
41,Burden
42,Vengeance
43,Opportunity
44,Faction
45,Danger
46,Corruption
47,Freedom
48,Debt
49,Hate
50,Possession
51,Stranger
52,Passage
53,Land
54,Creature
55,Disease
56,Advantage
57,Blood
58,Language
59,Rumor
60,Weakness
61,Greed
62,Family
63,Resource
64,Structure
65,Dream
66,Community
67,War
68,Portent
69,Prize
70,Destiny
71,Momentum
72,Power
73,Memory
74,Ruin
75,Mysticism
76,Rival
77,Problem
78,Idea
79,Revenge
80,Health
81,Fellowship
82,Enemy
83,Religion
84,Spirit
85,Fame
86,Desolation
87,Strength
88,Knowledge
89,Truth
90,Quest
91,Pride
92,Loss
93,Law
94,Path
95,Warning
96,Relationship
97,Wealth
98,Home
99,Strategy
00,Supply
```
## Region & Location
``` table Region
1-12,Barrier Islands
13-24,Ragged Coast
25-34,Deep Wilds
35-46,Flooded Lands
47-60,Havens
61-72,Hinterlands
73-84,Tempest Hills
85-94,Veiled Mountains
95-99,Shattered Wastes
00,Elsewhere
```
``` table Location
1,Hideout
2,Ruin
3,Mine
4,Waste
5,Mystical Site
6,Path
7,Outpost
8,Wall
9,Battlefield
10,Hovel
11,Spring
12,Lair
13,Fort
14,Bridge
15,Camp
16,Cairn/Grave
17-18,Caravan
19-20,Waterfall
21-22,Cave
23-24,Swamp
25-26,Fen
27-28,Ravine
29-30,Road
31-32,Tree
33-34,Pond
35-36,Fields
37-38,Marsh
39-40,Steading
41-42,Rapids
43-44,Pass
45-46,Trail
47-48,Glade
49-50,Plain
51-52,Ridge
53-54,Cliff
55-56,Grove
57-58,Village
59-60,Moor
61-62,Thicket
63-64,River Ford
65-66,Valley
67-68,Bay/Fjord
69-70,Foothills
71-72,Lake
73-75,River
76-79,Forest
80-83,Coast
84-88,Hill
89-93,Mountain
94-99,Woods
00,Anomaly
```
``` table Coastal Waters Location
1,Fleet
2,Sargassum
3,Flotsam
4,Mystical Site
5,Lair
6-10,Wreck
11-15,Harbor
16-23,Ship
24-30,Rocks
31-38,Fjord
39-46,Estuary
47-54,Cove
55-62,Bay
63-70,Ice
71-85,Island
86-99,Open Water
00,Anomaly
```
``` table Location Descriptor
1-2,High
3-4,Remote
5-6,Exposed
7-8,Small
9-10,Broken
11-12,Diverse
13-14,Rough
15-16,Dark
17-18,Shadowy
19-20,Contested
21-22,Grim
23-24,Wild
25-26,Fertile
27-28,Blocked
29-30,Ancient
31-32,Perilous
33-34,Hidden
35-36,Occupied
37-38,Rich
39-40,Big
41-42,Savage
43-44,Defended
45-46,Withered
47-48,Mystical
49-50,Inaccessible
51-52,Protected
53-54,Abandoned
55-56,Wide
57-58,Foul
59-60,Dead
61-62,Ruined
63-64,Barren
65-66,Cold
67-68,Blighted
69-70,Low
71-72,Beautiful
73-74,Abundant
75-76,Lush
77-78,Flooded
79-80,Empty
81-82,Strange
83-84,Corrupted
85-86,Peaceful
87-88,Forgotten
89-90,Expansive
91-92,Settled
93-94,Dense
95-96,Civilized
97-98,Desolate
99-00,Isolated
```
## Settlement
``` table Settlement Name
01-15,A feature of the landscape
16-30,A manmade edifice
31-45,A creature
46-60,A historical event
61-75,A word in an Old World language
76-90,A season or environmental aspect
91-100,Something Else
```
``` table Settlement Name: Feature of the landscape
1-10,Highmount
51-60,Stoneford
11-20,Brackwater
61-70,Deepwater
21-30,Frostwood
71-80,Whitefall
31-40,Redcrest
81-90,Graycliff
41-50,Grimtree
91-00,Three Rivers
```
``` table Settlement Name: Manmade edifice
1-10,Whitebridge
51-60,Timberwall
11-20,Lonefort
61-70,Stonetower
21-30,Highcairn
71-80,Thornhall
31-40,Redhall
81-90,Cinderhome
41-50,Darkwell
91-00,Fallowfield
```
``` table Settlement Name: Creature
1-10,Ravencliff
51-60,Boarwood
11-20,Bearmark
61-70,Foxhollow
21-30,Wolfcrag
71-80,Elderwatch
31-40,Eaglespire
81-90,Elkfield
41-50,Wyvern's Rest
91-00,Dragonshadow
```
``` table Settlement Name: Historical event
1-10,Swordbreak
51-60,Olgar's Stand
11-20,Fool's Fall
61-70,Lostwater
21-30,Firstmeet
71-80,Rojirra's Lament
31-40,Brokenhelm
81-90,Lastmarch
41-50,Mournhaunt
91-00,Rockfall
```
``` table Settlement Name: Word in an Old World language
1-10,Abon
51-60,Kazeera
11-20,Daveza
61-70,Khazu
21-30,Damula
71-80,Sova
31-40,Essus
81-90,Nabuma
41-50,Sina
91-00,Tiza
```
``` table Settlement Name: Season or environmental aspect
1-10,Winterhome
51-60,Duskmoor
11-20,Windhaven
61-70,Frostcrag
21-30,Stormrest
71-80,Springbrook
31-40,Bleakfrost
81-90,Icebreak
41-50,Springtide
91-00,Summersong
```
``` table Settlement Name: Something else
1-10,A trade good (Ironhome)
11-20,An Old World city (New Arkesh)
21-30,A founder or famous settler (Kei's Hall)
31-40,A god (Elisora)
41-50,A historical item (Blackhelm)
51-60,A firstborn race (Elfbrook)
61-70,An elvish word or name (Nessana)
71-80,A mythic belief or event (Ghostwalk)
81-90,A positive term (Hope)
91-00,A negative term (Forsaken)
```
``` table Quick Settlement Name Prefix
1-4,Bleak-
5-8,Green-
9-12,Wolf-
13-16,Raven-
17-20,Gray-
21-24,Red-
25-28,Axe-
29-32,Great-
33-36,Wood-
37-40,Low-
41-44,White-
45-48,Storm-
49-52,Black-
53-56,Mourn-
57-60,New-
61-64,Stone-
65-68,Grim-
69-72,Lost-
73-76,High-
77-80,Rock-
81-84,Shield-
85-88,Sword-
89-92,Frost-
93-96,Thorn-
97-00,Long-
```
``` table Quick Settlement Name Suffix
1-4,-moor
5-8,-ford
9-12,-crag
13-16,-watch
17-20,-hope
21-24,-wood
25-28,-ridge
29-32,-stone
33-36,-haven
37-40,-fall(s)
41-44,-river
45-48,-field
49-52,-hill
53-56,-bridge
57-60,-mark
61-64,-cairn
65-68,-land
69-72,-hall
73-76,-mount
77-80,-rock
81-84,-brook
85-88,-barrow
89-92,-stead
93-96,-home
97-00,-wick
```
``` table Settlement Trouble
1-2,Outsiders rejected
3-4,Dangerous discovery
5-6,Dreadful omens
7-8,Natural disaster
9-10,Old wounds reopened
11-12,Important object is lost
13-14,Someone is captured
15-16,Mysterious phenomenon
17-18,Revolt against a leader
19-20,Vengeful outcast
21-22,Rival settlement
23-24,Nature strikes back
25-26,Someone is missing
27-28,Production halts
29-30,Mysterious murders
31-32,Debt comes due
33-34,Unjust leadership
35-36,Disastrous accident
37-38,In league with the enemy
39-40,Raiders prey on the weak
41-42,Cursed past
43-44,An innocent is accused
45-46,Corrupted by dark magic
47-48,Isolated by brutal weather
49-50,Provisions are scarce
51-52,Sickness run amok
53-54,Allies become enemies
55-56,Attack is imminent
57-58,Lost caravan
59-60,Dark secret revealed
61-62,Urgent expedition
63-64,A leader falls
65-66,Families in conflict
67-68,Incompetent leadership
69-70,Reckless warmongering
71-72,Beast on the hunt
73-74,Betrayed from within
75-76,Broken truce
77-78,Wrathful haunt
79-80,Conflict with firstborn
81-82,Trade route blocked
83-84,In the crossfire
85-86,Stranger causes discord
87-88,Important event threatened
89-90,Dangerous tradition
91-00,Roll twice
```
## Character
``` table Character Role
1-2,Criminal
3-4,Healer
5-6,Bandit
7-9,Guide
10-12,Performer
13-15,Miner
16-18,Mercenary
19-21,Outcast
22-24,Vagrant
25-27,Forester
28-30,Traveler
31-33,Mystic
34-36,Priest
37-39,Sailor
40-42,Pilgrim
43-45,Thief
46-48,Adventurer
49-51,Forager
52-54,Leader
55-58,Guard
59-62,Artisan
63-66,Scout
67-70,Herder
71-74,Fisher
75-79,Warrior
80-84,Hunter
85-89,Raider
90-94,Trader
95-99,Farmer
00,Unusual role
```
``` table Character Goal
1-3,Obtain an object
4-6,Make an agreement
7-9,Build a relationship
10-12,Undermine a relationship
13-15,Seek a truth
16-18,Pay a debt
19-21,Refute a falsehood
22-24,Harm a rival
25-27,Cure an ill
28-30,Find a person
31-33,Find a home
34-36,Seize power
37-39,Restore a relationship
40-42,Create an item
43-45,Travel to a place
46-48,Secure provisions
49-51,Rebel against power
52-54,Collect a debt
55-57,Protect a secret
58-60,Spread faith
61-63,Enrich themselves
64-66,Protect a person
67-69,Protect the status quo
70-72,Advance status
73-75,Defend a place
76-78,Avenge a wrong
79-81,Fulfill a duty
82-84,Gain knowledge
85-87,Prove worthiness
88-90,Find redemption
91-92,Escape from something
93-95,Resolve a dispute
96-00,Roll twice
```
``` table Character Descriptor
1,Stoic
2,Attractive
3,Passive
4,Aloof
5,Affectionate
6,Generous
7,Smug
8,Armed
9,Clever
10,Brave
11,Ugly
12,Sociable
13,Doomed
14,Connected
15,Bold
16,Jealous
17,Angry
18,Active
19,Suspicious
20,Hostile
21,Hardhearted
22,Successful
23,Talented
24,Experienced
25,Deceitful
26,Ambitious
27,Aggressive
28,Conceited
29,Proud
30,Stern
31,Dependent
32,Wary
33,Strong
34,Insightful
35,Dangerous
36,Quirky
37,Cheery
38,Disfigured
39,Intolerant
40,Skilled
41,Stingy
42,Timid
43,Insensitive
44,Wild
45,Bitter
46,Cunning
47,Remorseful
48,Kind
49,Charming
50,Oblivious
51,Critical
52,Cautious
53,Resourceful
54,Weary
55,Wounded
56,Anxious
57,Powerful
58,Athletic
59,Driven
60,Cruel
61,Quiet
62,Honest
63,Infamous
64,Dying
65,Reclusive
66,Artistic
67,Disabled
68,Confused
69,Manipulative
70,Relaxed
71,Stealthy
72,Confident
73,Weak
74,Friendly
75,Wise
76,Influential
77,Young
78,Adventurous
79,Oppressed
80,Vengeful
81,Cooperative
82,Armored
83,Apathetic
84,Determined
85,Loyal
86,Sick
87,Religious
88,Selfish
89,Old
90,Fervent
91,Violent
92,Agreeable
93,Hot-tempered
94,Stubborn
95,Incompetent
96,Greedy
97,Cowardly
98,Obsessed
99,Careless
00,Ironsworn
```
``` table Ironlander Names
1,Solana
2,Keelan
3,Cadigan
4,Sola
5,Kodroth
6,Kione
7,Katja
8,Tio
9,Artiga
10,Eos
11,Bastien
12,Elli
13,Maura
14,Haleema
15,Abella
16,Morter
17,Wulan
18,Mai
19,Farina
20,Pearce
21,Wynne
22,Haf
23,Aeddon
24,Khinara
25,Milla
26,Nakata
27,Kynan
28,Kiah
29,Jaggar
30,Beca
31,Ikram
32,Melia
33,Sidan
34,Deshi
35,Tessa
36,Sibila
37,Morien
38,Mona
39,Padma
40,Avella
41,Naila
42,Lio
43,Cera
44,Ithela
45,Zhan
46,Kaivan
47,Valeri
48,Hirsham
49,Pemba
50,Edda
51,Lestara
52,Lago
53,Elstan
54,Saskia
55,Kabeera
56,Caldas
57,Nisus
58,Serene
59,Chenda
60,Themon
61,Erin
62,Alban
63,Parcell
64,Jelma
65,Willa
66,Nadira
67,Gwen
68,Amara
69,Masias
70,Kanno
71,Razeena
72,Mira
73,Perella
74,Myrick
75,Qamar
76,Kormak
77,Zura
78,Zanita
79,Brynn
80,Tegan
81,Pendry
82,Quinn
83,Fanir
84,Glain
85,Emelyn
86,Kendi
87,Althus
88,Leela
89,Ishana
90,Flint
91,Delkash
92,Nia
93,Nan
94,Keeara
95,Katania
96,Morell
97,Temir
98,Bas
99,Sabine
00,Tallus
```
``` table Elf Names
1-2,Arsula
3-4,Naidita
5-6,Belesunna
7-8,Vidarna
9-10,Ninsunu
11-12,Balathu
13-14,Dorosi
15-16,Gezera
17-18,Zursan
19-20,Seleeku
21-22,Utamara
23-24,Nebakay
25-26,Dismashk
27-28,Mitunu
29-30,Atani
31-32,Kinzura
33-34,Sumula
35-36,Ukames
37-38,Ahmeshki
39-40,Ilsit
41-42,Mayatanay
43-44,Etana
45-46,Gamanna
47-48,Nessana
49-50,Uralar
51-52,Tishetu
53-54,Leucia
55-56,Sutahe
57-58,Dotani
59-60,Uktannu
61-62,Retenay
63-64,Kendalanu
65-66,Tahuta
67-68,Mattissa
69-70,Anatu
71-72,Aralu
73-74,Arakhi
75-76,Ibrahem
77-78,Sinosu
79-80,Jemshida
81-82,Visapni
83-84,Hullata
85-86,Sidura
87-88,Kerihu
89-90,Ereshki
91-92,Cybela
93-94,Anunna
95-96,Otani
97-98,Ditani
99-00,Faraza
```
``` table Giant Names
1-4,Chony
5-8,Banda
9-12,Jochu
13-16,Kira
17-20,Khatir
21-24,Chaidu
25-28,Atan
29-32,Buandu
33-36,Javyn
37-40,Khashin
41-44,Bayara
45-48,Temura
49-52,Kidha
53-56,Kathos
57-60,Tanua
61-64,Bashtu
65-68,Jaran
69-72,Othos
73-76,Khutan
77-80,Otaan
81-84,Martu
85-88,Baku
89-92,Tuban
93-96,Qudan
97-00,Denua
```
``` table Varou Names
1-4,Vata
5-8,Zora
9-12,Jasna
13-16,Charna
17-20,Tana
21-24,Soveen
25-28,Radka
29-32,Zlata
33-36,Leesla
37-40,Byna
41-44,Meeka
45-48,Iskra
49-52,Jarek
53-56,Darva
57-60,Neda
61-64,Keha
65-68,Zhivka
69-72,Kvata
73-76,Staysa
77-80,Evka
81-84,Vuksha
85-88,Muko
89-92,Dreko
93-96,Aleko
97-00,Vojan
```
``` table Troll Names
1-4,Rattle
5-8,Scratch
9-12,Wallow
13-16,Groak
17-20,Gimble
21-24,Scar
25-28,Cratch
29-32,Creech
33-36,Shush
37-40,Glush
41-44,Slar
45-48,Gnash
49-52,Stoad
53-56,Grig
57-60,Bleat
61-64,Chortle
65-68,Cluck
69-72,Slith
73-76,Mongo
77-80,Creak
81-84,Burble
85-88,Vrusk
89-92,Snuffle
93-96,Leech
97-00,Herk
```
## Other
``` table Combat Action
1-3,Compel a surrender.
4-6,Coordinate with allies.
7-9,Gather reinforcements.
10-13,Seize something or someone.
14-17,Provoke a reckless response.
18-21,Intimidate or frighten.
22-25,Reveal a surprising truth.
26-29,Shift focus to someone or something else.
30-33,"Destroy something, or render it useless."
34-39,Take a decisive action.
40-45,Reinforce defenses.
46-52,Ready an action.
53-60,Use the terrain to gain advantage.
61-68,Leverage the advantage of a weapon or ability.
69-78,Create an opportunity.
79-89,Attack with precision.
90-99,Attack with power.
00,Take a completely unexpected action.
```
``` table Mystic Backlash
1-4,"Your ritual has the opposite affect."
5-8,"You are sapped of strength."
9-12,"Your friend, ally, or companion is adversely affected."
13-16,"You destroy an important object."
17-20,"You inadvertently summon a horror."
21-24,"You collapse, and drift into a troubled sleep."
25-28,"You undergo a physical torment which leaves its mark upon you."
29-32,"You hear ghostly voices whispering of dark portents."
33-36,"You are lost in shadow, and find yourself in another place without memory of how you got there."
37-40,"You alert someone or something to your presence."
41-44,"You are not yourself, and act against a friend, ally, or companion."
45-48,"You affect or damage your surroundings, causing a disturbance or potential harm."
49-52,"You waste resources."
53-56,"You suffer the loss of a sense for several hours."
57-60,"You lose your connection to magic for a day or so, and cannot perform rituals."
61-64,"Your ritual affects the target in an unexpected and problematic way."
65-68,"Your ritual reveals a surprising and troubling truth."
69-72,"You are tempted by dark powers."
73-76,"You see a troubling vision of your future."
77-80,"You can't perform this ritual again until you acquire an important component."
81-84,"You develop a strange fear or compulsion."
85-88,"Your ritual causes creatures to exhibit strange or aggressive behavior."
89-92,"You are tormented by an apparition from your past."
93-96,"You are wracked with sudden sickness."
97-00,"Roll twice more on this table. Both results occur. If they are the same result, make it worse."
```
``` table Major Plot Twist
1-5,It was all a diversion.
6-10,A dark secret is revealed.
11-15,A trap is sprung.
16-20,An assumption is revealed to be false.
21-25,A secret alliance is revealed.
26-30,Your actions benefit an enemy.
31-35,Someone returns unexpectedly.
36-40,A more dangerous foe is revealed.
41-45,You and an enemy share a common goal.
46-50,A true identity is revealed.
51-55,You are betrayed by someone who was trusted.
56-60,You are too late.
61-65,The true enemy is revealed.
66-70,The enemy gains new allies.
71-75,A new danger appears.
76-80,Someone or something goes missing.
81-85,The truth of a relationship is revealed.
86-90,Two seemingly unrelated situations are shown to be connected.
91-95,Unexpected powers or abilities are revealed.
96-00,"Roll twice more on this table. Both results occur. If they are the same result, make it more dramatic."
```
``` table Challenge Rank
1-20,Troublesome
21-55,Dangerous
56-80,Formidable
81-93,Extreme
94-00,Epic
```