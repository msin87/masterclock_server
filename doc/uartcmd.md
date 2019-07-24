# UART commands list  

List of commands for controlling the microcontroller via UART  

[TOC]



## Main structure of commands and responses  

|  0   |  1   | ...  |  28  |    29    |    30    |    31    |    32    |
| :--: | :--: | :--: | :--: | :------: | :------: | :------: | :------: |
| CMD  | DATA | DATA | DATA | CRC32[3] | CRC32[2] | CRC32[1] | CRC32[0] |

  *Total frame length: 33 bytes.*   

## Commands  

*Frame formats are given without CRC32 bytes.*

### 0x00 Restart microcontroller

### 0x01 Set the number *N* of pulses to send for the specified lines

*Frame format*:

|  0   |       1        |       2        |  3   |  4   | ...  |  27  |  28  |
| :--: | :------------: | :------------: | :--: | :--: | :--: | :--: | :--: |
| 0x01 | ID<sub>1</sub> | ID<sub>0</sub> | N[1] | N[0] | ...  | N[1] | N[0] |

*Explanations*:
In ID<sub>1</sub> and ID<sub>0</sub> bytes, the numbers (identifiers) of the lines for which data (number of pulses) will be transmitted in the next bytes are set by bits. ID<sub>0</sub> allows you to set lines with id from 0 to 7. ID<sub>1</sub> - id from 8 to 11. Next are the high and low bytes of the `uint16` type number for the lines specified earlier. First comes the number for the line with the lowest id contained in ID<sub>0</sub> and ID<sub>1</sub> bytes.

| bit  | ID<sub>1</sub>[7] | ID<sub>1</sub>[6] | ID<sub>1</sub>[5] | ID<sub>1</sub>[4] | ID<sub>1</sub>[3] | ID<sub>1</sub>[2] | ID<sub>1</sub>[1] | ID<sub>1</sub>[0] | ID<sub>0</sub>[7] | ID<sub>0</sub>[6] | ID<sub>0</sub>[5] | ID<sub>0</sub>[4] | ID<sub>0</sub>[3] | ID<sub>0</sub>[2] | ID<sub>0</sub>[1] | ID<sub>0</sub>[0] |
| :--: | :---------------: | :---------------: | :---------------: | :---------------: | :---------------: | :---------------: | :---------------: | :---------------: | :---------------: | :---------------: | :---------------: | :---------------: | :---------------: | :---------------: | :---------------: | :---------------: |
| line |         -         |         -         |         -         |         -         |        11         |        10         |         9         |         8         |         7         |         6         |         5         |         4         |         3         |         2         |         1         |         0         |

*Example* :

```
(hex): 01 04 5A 02 D0 02 CF 02 CE 02 CD 02 CC
```

|  data   |             description             |
| :-----: | :---------------------------------: |
|  `01`   |                 CMD                 |
|  `04`   |        line ID<sub>10</sub>         |
|  `5A`   |     lines ID<sub>6,4,3,1</sub>      |
| `D0 02` | 720 pulses for line ID<sub>1</sub>  |
| `02 CF` | 719 pulses for line ID<sub>3</sub>  |
| `02 CE` | 718 pulses for line ID<sub>4</sub>  |
| `02 CD` | 717 pulses for line ID<sub>6</sub>  |
| `02 CC` | 716 pulses for line ID<sub>10</sub> |

### 0x02 Increment the pulse counter by 1 for the specified lines

*Frame format*:

|  0   |  1   |  2   |
| :--: | :--: | :--: |
| 0x02 | ID1  | ID0  |

*Explanations*: 
*See description of ID<sub>0</sub> and ID<sub>1</sub> bytes in command description 0x01*
Increases the pulse counter for sending to the line by 1 without overwriting the counter. Also allows you to add one minute during the process of setting the correct time (that is, sending a long sequence of pulses)
*Example* :

```
(hex): 02 04 5A
```

See command 0x01. 

### 0x03 Reset pulse counter for the specified lines

*Frame format*:

|  0   |       1        |       2        |
| :--: | :------------: | :------------: |
| 0x03 | <sub>ID1</sub> | <sub>ID0</sub> |

*Explanations*: 
*See description of ID<sub>0</sub> and ID<sub>1</sub> bytes in command description 0x01*
Resets the pulse counter to 0.
*Example* :

```
(hex): 03 04 5A
```

See command 0x01. 

### 0x04 Suspend pulse counter processing for the specified lines.

*Frame format*:

|  0   |       1        |  2   |
| :--: | :------------: | :--: |
| 0x04 | <sub>ID1</sub> | ID0  |

*Explanations*: 
*See description of <sub>ID0</sub> and <sub>ID1</sub> bytes in command description 0x01*
Sending pulses is blocked. Changing the pulse counter through the UART is not blocked. It is used when receiving an overload signal or for pausing a clock adjustment,
*Example* :

```
 (hex): 04 04 5A
```

See command 0x01. 

### 0x05 Resume pulse counter processing for the specified lines.

*Frame format*:

|  0   |       1        |       2        |
| :--: | :------------: | :------------: |
| 0x05 | ID<sub>1</sub> | ID<sub>0</sub> |

*Explanations*: 
*See description of ID<sub>0</sub> and ID<sub>1</sub> bytes in command description 0x01*
Resume pulse counter processing after suspend command 0x04
*Example* :

```
 (hex): 05 04 5A
```

See command 0x01. 

### 0x06 Set pulse width

*Frame format*:

|  0   |       1        |       2        |   3   |  ...  |  14   |
| :--: | :------------: | :------------: | :---: | :---: | :---: |
| 0x05 | ID<sub>1</sub> | ID<sub>0</sub> | WIDTH | WIDTH | WIDTH |

*Explanations*: 
*See description of ID<sub>0</sub> and ID<sub>1</sub> bytes in command description 0x01*
Resume pulse counter processing after suspend command 0x04

|   WIDTH(hex)    |  00  |  01  |  02  |  03  |  04  |  05  |  06  |  07  |  08  |  09  |  0A  |  0B  |  0C  |  0D  |  0E  |  0F  |
| :-------------: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: |
| Pulse width(ms) | 250  | 500  | 750  | 1000 | 1250 | 1500 | 1750 | 2000 | 2250 | 2500 | 2750 | 3000 | 3250 | 3500 | 3750 | 4000 |

*Example* :

```
 (hex): 06 04 5A 01 03 05 07 03
```

| data |           description            |
| :--: | :------------------------------: |
| `06` |               CMD                |
| `04` |       line ID<sub>10</sub>       |
| `5A` |    lines ID<sub>6,4,3,1</sub>    |
| `01` |  500 ms for line ID<sub>1</sub>  |
| `03` | 1000 ms for line ID<sub>3</sub>  |
| `05` | 1500 ms for line ID<sub>4</sub>  |
| `07` | 2000 ms for line ID<sub>6</sub>  |
| `03` | 1000 ms for line ID<sub>10</sub> |

## Responses 

*Frame formats are given without CRC32 bytes.*

### ~~0x00  *Reserved~~*

### 0x01 Pulse counters

 *Frame format*: 

|  0   |       1        |       2        |  3   |  4   | ...  |  27  |  28  |
| :--: | :------------: | :------------: | :--: | :--: | :--: | :--: | :--: |
| 0x01 | ID<sub>1</sub> | ID<sub>0</sub> | N[1] | N[0] | ...  | N[1] | N[0] |

*Explanations*: 
It is returned after each sending of the pulse. Contains the current states of the pulse counters.
*Also see command 0x01.*

### 0x02 Measured current in 8 bit representation

*Frame format*: 

|  0   |       1        |       2        |               3               |              ...              |              14               |
| :--: | :------------: | :------------: | :---------------------------: | :---------------------------: | :---------------------------: |
| 0x02 | ID<sub>1</sub> | ID<sub>0</sub> | I<sup>8bit</sup><sub>ma</sub> | I<sup>8bit</sup><sub>ma</sub> | I<sup>8bit</sup><sub>ma</sub> |

*Explanations*: 
It is returned after each sending of the pulse. Contains an 8-bit representation of the current received from the current sensor of each line. 
ID<sub>12</sub> corresponds to the total current consumption received from the total current sensor. ID<sub>12</sub> is transmitted in a separate frame.
*Also see command 0x01.*