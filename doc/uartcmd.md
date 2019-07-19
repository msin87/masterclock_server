# UART commands list  
List of commands for controlling the microcontroller via UART  

## Main structure of commands and responses:  
  
### Frame  

| 0 | 1 | ... | 28 | 29 | 30 | 31 | 32 |  
|:----:|:----:|:-----:|:---:|:------:|:------:|:------:|:-------:|  
| CMD  | DATA | DATA  | DATA|CRC32[3]|CRC32[2]|CRC32[1]| CRC32[0]|  

  *Total frame length: 33 bytes.*   
### Commands  
*Frame formats are given without CRC32 bytes.*

 #### 0x00 
 *Description*: Restart the microcontroller
 #### 0x01 
 *Description*: Set the number *N* of pulses to send for the specified lines
*Frame format*:

 | 0  |  1 |  2 |  3 | 4|...|27|28|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 0x01  | ID~1~| ID~0~| N[1]  |N[0] |...|N[1]|N[0]

*Explanations*:
In ID~1~ and ID~0~ bytes, the numbers (identifiers) of the lines for which data (number of pulses) will be transmitted in the next bytes are set by bits. ID~0~ allows you to set lines with id from 0 to 7. ID~1~ - id from 8 to 11. Next are the high and low bytes of the `uint16` type number for the lines specified earlier. First comes the number for the line with the lowest id contained in ID~0~ and ID~1~ bytes.

|bit| ID~1~[7] | ID~1~[6] |  ID~1~[5] |  ID~1~[4] |  ID~1~[3] | ID~1~[2] | ID~1~[1] | ID~1~[0] | ID~0~[7] | ID~0~[6]| ID~0~[5]| ID~0~[4]| ID~0~[3]| ID~0~[2]| ID~0~[1]| ID~0~[0]|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| line| -  | -  | -  | -  | 11  | 10  | 9  |  8 | 7  | 6  | 5  | 4  | 3  | 2  | 1  | 0  |

*Example* :

    (hex): 01 04 5A 02 D0 02 CF 02 CE 02 CD 02 CC
    
|  data 	| description  	|
|:-:	|:-	|
| `01`|CMD 	|
|  `04` 	|   line ID~10~|
|   `5A`	|  lines ID~6,4,3,1~	|
|  `D0 02`  	|720 pulses for line ID~1~   	|
|  `02 CF` 	| 719 pulses for line ID~3~  	|
|   `02 CE`	| 718 pulses for line ID~4~ 	|
|  `02 CD` 	| 717 pulses for line ID~6~ 	|
|`02 CC` |716 pulses for line ID~10~|

#### 0x02 
 *Description*: Increment the pulse counter by 1 for the specified lines
*Frame format*:

| 0  |  1 |  2 |
|:-:|:-:|:-:|
| 0x02  | ID1  | ID0  |

*Explanations*: 
*See description of ID~0~ and ID~1~ bytes in command description 0x01*
Increases the pulse counter for sending to the line by 1 without overwriting the counter. Also allows you to add one minute during the process of setting the correct time (that is, sending a long sequence of pulses)
*Example* :

    (hex): 02 04 5A
See command 0x01. 

#### 0x03 
 *Description*: Reset pulse counter for the specified lines
*Frame format*:

| 0  |  1 |  2 |
|:-:|:-:|:-:|
| 0x03  | ID1  | ID0  |

*Explanations*: 
*See description of ID~0~ and ID~1~ bytes in command description 0x01*
Resets the pulse counter to 0.
*Example* :

    (hex): 03 04 5A
See command 0x01. 
#### 0x04 
 *Description*: Suspend pulse counter processing for the specified lines.
*Frame format*:

| 0  |  1 |  2 |
|:-:|:-:|:-:|
| 0x04  | ID1  | ID0  |

*Explanations*: 
*See description of ID0 and ID1 bytes in command description 0x01*
Sending pulses is blocked. Changing the pulse counter through the UART is not blocked. It is used when receiving an overload signal or for pausing a clock adjustment,
*Example* :
   

     (hex): 04 04 5A

See command 0x01. 
#### 0x05 
 *Description*: Resume pulse counter processing for the specified lines.
*Frame format*:

| 0  |  1 |  2 |
|:-:|:-:|:-:|
| 0x05  | ID~1~ | ID~0~ |

*Explanations*: 
*See description of ID~0~ and ID~1~ bytes in command description 0x01*
Resume pulse counter processing after suspend command 0x04
*Example* :
   

     (hex): 05 04 5A

See command 0x01. 
#### 0x06
 *Description*: Set pulse width
*Frame format*:

|0|1|2|3|...|14|
|:-:|:-:|:-:|:-:|:-:|:-:|
| 0x05  | ID~1~ | ID~0~ |WIDTH|WIDTH| WIDTH|

*Explanations*: 
*See description of ID~0~ and ID~1~ bytes in command description 0x01*
Resume pulse counter processing after suspend command 0x04

|WIDTH(hex)|00|01|02|03|04|05|06|07|08|09|0A|0B|0C|0D|0E|0F|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|Pulse width (ms)|250|500|750|1000|1250|1500|1750|2000|2250|2500|2750|3000|3250|3500|3750|4000

*Example* :
   

     (hex): 06 04 5A 01 03 05 07 03

|  data 	| description  	|
|:-:	|:-	|
| `06`|CMD 	|
|  `04` 	|   line ID~10~ 	|
|   `5A`	|  lines ID~6,4,3,1~ 	|
|  `01`  	|500 ms for line ID~1~  	|
|  `03` 	| 1000 ms for line ID~3~ 	|
|   `05`	| 1500 ms for line ID~4~ 	|
|  `07` 	| 2000 ms for line ID~6~	|
|`03`       |1000 ms for line ID~10~|

### Responses
*Frame formats are given without CRC32 bytes.*
#### 0x00 
*Reserved*
#### 0x01 
*Description*: Pulse counters.
 
 | 0  |  1 |  2 |  3 | 4|...|27|28|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 0x01  | ID~1~| ID~0~| N[1]  |N[0] |...|N[1]|N[0]

*Explanations*: 
It is returned after each sending of the pulse. Contains the current states of the pulse counters.
*Also see command 0x01.*
#### 0x02 
*Description*: Measured current in 8 bit representation for lines.

|0|1|2|3|...|14|
|:-:|:-:|:-:|:-:|:-:|:-:|
| 0x02  | ID~1~ | ID~0~ |I^8bit^~ma~|I^8bit^~ma~| I^8bit^~ma~|

*Explanations*: 
It is returned after each sending of the pulse. Contains an 8-bit representation of the current received from the current sensor of each line. 
ID~12~ corresponds to the total current consumption received from the total current sensor. ID~12~ is transmitted in a separate frame.
*Also see command 0x01.*
