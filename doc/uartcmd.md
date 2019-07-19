# UART commands list  
List of commands for controlling the microcontroller via UART  
  
## Main structure of commands:  
  
### Frame  
| 0 | 1 | ... | 28 | 29 | 30 | 31 | 32 |  
|:----:|:----:|:-----:|:---:|:------:|:------:|:------:|:-------:|  
| CMD  | DATA | DATA  | DATA|CRC32[3]|CRC32[2]|CRC32[1]| CRC32[0]|  
  *Total frame length: 33 bytes.*   
### Commands  
*Frame formats are given without CRC32 bytes.*

#### 0x00 ####
 
 *Description*: Restart the microcontroller
#### 0x01 ####
 *Description*: Set the number *N* of pulses to send to the line ID
*Frame format*:

 | 0  |  1 |  2 |  3 | 4|...|27|28|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 0x01  | ID1  | ID0  | Nid0[1]  |Nid0[0] |...|Nid12[1]|Nid12[0]

*Explanations*:
In ID1 and ID0 bytes, the numbers (identifiers) of the lines for which data (number of pulses) will be transmitted in the next bytes are set by bits. ID0 allows you to set lines with id from 0 to 7. ID1 - id from 8 to 11. Next are the high and low bytes of the uint16 type number for the lines specified earlier. First comes the number for the line with the lowest id contained in ID0 and ID1 bytes.

|bit| ID1[7] | ID1[6] |  ID1[5] |  ID1[4] |  ID1[3] | ID1[2] | ID1[1] | ID1[0] | ID0[7] | ID0[6]| ID0[5]| ID0[4]| ID0[3]| ID0[2]| ID0[1]| ID0[0]|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| line| -  | -  | -  | -  | 11  | 10  | 9  |  8 | 7  | 6  | 5  | 4  | 3  | 2  | 1  | 0  |

*Example* :

    (hex): 01 04 5A 02 D0 02 CF 02 CE 02 CD 02 CC

|  data 	| description  	|
|:-:	|:-:	|
| `01`|CMD 	|
|  `04` 	|   line ID 10	|
|   `5A`	|  lines ID 6,4,3,1 	|
|  `D0 02`  	|720 pulses for line ID 1   	|
|  `02 CF` 	| 719 pulses for line ID 3  	|
|   `02 CE`	| 718 pulses for line ID 4  	|
|  `02 CD` 	| 717 pulses for line ID 6  	|
|`02 CC` |716 pulses for line ID 10 |
