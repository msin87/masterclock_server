---


---

<h1 id="uart-commands-list">UART commands list</h1>
<p>List of commands for controlling the microcontroller via UART</p>
<h2 id="main-structure-of-commands-and-responses">Main structure of commands and responses:</h2>
<h3 id="frame">Frame</h3>

<table>
<thead>
<tr>
<th align="center">0</th>
<th align="center">1</th>
<th align="center">…</th>
<th align="center">28</th>
<th align="center">29</th>
<th align="center">30</th>
<th align="center">31</th>
<th align="center">32</th>
</tr>
</thead>
<tbody>
<tr>
<td align="center">CMD</td>
<td align="center">DATA</td>
<td align="center">DATA</td>
<td align="center">DATA</td>
<td align="center">CRC32[3]</td>
<td align="center">CRC32[2]</td>
<td align="center">CRC32[1]</td>
<td align="center">CRC32[0]</td>
</tr>
</tbody>
</table><p><em>Total frame length: 33 bytes.</em></p>
<h3 id="commands">Commands</h3>
<p><em>Frame formats are given without CRC32 bytes.</em></p>
<h4 id="x00">0x00</h4>
<p><em>Description</em>: Restart microcontroller</p>
<h4 id="x01">0x01</h4>
<p><em>Description</em>: Set the number <em>N</em> of pulses to send for the specified lines<br>
<em>Frame format</em>:</p>

<table>
<thead>
<tr>
<th align="center">0</th>
<th align="center">1</th>
<th align="center">2</th>
<th align="center">3</th>
<th align="center">4</th>
<th align="center">…</th>
<th align="center">27</th>
<th align="center">28</th>
</tr>
</thead>
<tbody>
<tr>
<td align="center">0x01</td>
<td align="center">ID<sub>1</sub></td>
<td align="center">ID<sub>0</sub></td>
<td align="center">N[1]</td>
<td align="center">N[0]</td>
<td align="center">…</td>
<td align="center">N[1]</td>
<td align="center">N[0]</td>
</tr>
</tbody>
</table><p><em>Explanations</em>:<br>
In ID<sub>1</sub> and ID<sub>0</sub> bytes, the numbers (identifiers) of the lines for which data (number of pulses) will be transmitted in the next bytes are set by bits. ID<sub>0</sub> allows you to set lines with id from 0 to 7. ID<sub>1</sub> - id from 8 to 11. Next are the high and low bytes of the <code>uint16</code> type number for the lines specified earlier. First comes the number for the line with the lowest id contained in ID<sub>0</sub> and ID<sub>1</sub> bytes.</p>

<table>
<thead>
<tr>
<th align="center">bit</th>
<th align="center">ID<sub>1</sub>[7]</th>
<th align="center">ID<sub>1</sub>[6]</th>
<th align="center">ID<sub>1</sub>[5]</th>
<th align="center">ID<sub>1</sub>[4]</th>
<th align="center">ID<sub>1</sub>[3]</th>
<th align="center">ID<sub>1</sub>[2]</th>
<th align="center">ID<sub>1</sub>[1]</th>
<th align="center">ID<sub>1</sub>[0]</th>
<th align="center">ID<sub>0</sub>[7]</th>
<th align="center">ID<sub>0</sub>[6]</th>
<th align="center">ID<sub>0</sub>[5]</th>
<th align="center">ID<sub>0</sub>[4]</th>
<th align="center">ID<sub>0</sub>[3]</th>
<th align="center">ID<sub>0</sub>[2]</th>
<th align="center">ID<sub>0</sub>[1]</th>
<th align="center">ID<sub>0</sub>[0]</th>
</tr>
</thead>
<tbody>
<tr>
<td align="center">line</td>
<td align="center">-</td>
<td align="center">-</td>
<td align="center">-</td>
<td align="center">-</td>
<td align="center">11</td>
<td align="center">10</td>
<td align="center">9</td>
<td align="center">8</td>
<td align="center">7</td>
<td align="center">6</td>
<td align="center">5</td>
<td align="center">4</td>
<td align="center">3</td>
<td align="center">2</td>
<td align="center">1</td>
<td align="center">0</td>
</tr>
</tbody>
</table><p><em>Example</em> :</p>
<pre><code>(hex): 01 04 5A 02 D0 02 CF 02 CE 02 CD 02 CC
</code></pre>

<table>
<thead>
<tr>
<th align="center">data</th>
<th align="left">description</th>
</tr>
</thead>
<tbody>
<tr>
<td align="center"><code>01</code></td>
<td align="left">CMD</td>
</tr>
<tr>
<td align="center"><code>04</code></td>
<td align="left">line ID<sub>10</sub></td>
</tr>
<tr>
<td align="center"><code>5A</code></td>
<td align="left">lines ID<sub>6,4,3,1</sub></td>
</tr>
<tr>
<td align="center"><code>D0 02</code></td>
<td align="left">720 pulses for line ID<sub>1</sub></td>
</tr>
<tr>
<td align="center"><code>02 CF</code></td>
<td align="left">719 pulses for line ID<sub>3</sub></td>
</tr>
<tr>
<td align="center"><code>02 CE</code></td>
<td align="left">718 pulses for line ID<sub>4</sub></td>
</tr>
<tr>
<td align="center"><code>02 CD</code></td>
<td align="left">717 pulses for line ID<sub>6</sub></td>
</tr>
<tr>
<td align="center"><code>02 CC</code></td>
<td align="left">716 pulses for line ID<sub>10</sub></td>
</tr>
</tbody>
</table><h4 id="x02">0x02</h4>
<p><em>Description</em>: Increment the pulse counter by 1 for the specified lines<br>
<em>Frame format</em>:</p>

<table>
<thead>
<tr>
<th align="center">0</th>
<th align="center">1</th>
<th align="center">2</th>
</tr>
</thead>
<tbody>
<tr>
<td align="center">0x02</td>
<td align="center">ID1</td>
<td align="center">ID0</td>
</tr>
</tbody>
</table><p><em>Explanations</em>:<br>
<em>See description of ID<sub>0</sub> and ID<sub>1</sub> bytes in command description 0x01</em><br>
Increases the pulse counter for sending to the line by 1 without overwriting the counter. Also allows you to add one minute during the process of setting the correct time (that is, sending a long sequence of pulses)<br>
<em>Example</em> :</p>
<pre><code>(hex): 02 04 5A
</code></pre>
<p>See command 0x01.</p>
<h4 id="x03">0x03</h4>
<p><em>Description</em>: Reset pulse counter for the specified lines<br>
<em>Frame format</em>:</p>

<table>
<thead>
<tr>
<th align="center">0</th>
<th align="center">1</th>
<th align="center">2</th>
</tr>
</thead>
<tbody>
<tr>
<td align="center">0x03</td>
<td align="center">ID1</td>
<td align="center">ID0</td>
</tr>
</tbody>
</table><p><em>Explanations</em>:<br>
<em>See description of ID<sub>0</sub> and ID<sub>1</sub> bytes in command description 0x01</em><br>
Resets the pulse counter to 0.<br>
<em>Example</em> :</p>
<pre><code>(hex): 03 04 5A
</code></pre>
<p>See command 0x01.</p>
<h4 id="x04">0x04</h4>
<p><em>Description</em>: Suspend pulse counter processing for the specified lines.<br>
<em>Frame format</em>:</p>

<table>
<thead>
<tr>
<th align="center">0</th>
<th align="center">1</th>
<th align="center">2</th>
</tr>
</thead>
<tbody>
<tr>
<td align="center">0x04</td>
<td align="center">ID1</td>
<td align="center">ID0</td>
</tr>
</tbody>
</table><p><em>Explanations</em>:<br>
<em>See description of ID0 and ID1 bytes in command description 0x01</em><br>
Sending pulses is blocked. Changing the pulse counter through the UART is not blocked. It is used when receiving an overload signal or for pausing a clock adjustment,<br>
<em>Example</em> :</p>
<pre><code> (hex): 04 04 5A
</code></pre>
<p>See command 0x01.</p>
<h4 id="x05">0x05</h4>
<p><em>Description</em>: Resume pulse counter processing for the specified lines.<br>
<em>Frame format</em>:</p>

<table>
<thead>
<tr>
<th align="center">0</th>
<th align="center">1</th>
<th align="center">2</th>
</tr>
</thead>
<tbody>
<tr>
<td align="center">0x05</td>
<td align="center">ID<sub>1</sub></td>
<td align="center">ID<sub>0</sub></td>
</tr>
</tbody>
</table><p><em>Explanations</em>:<br>
<em>See description of ID<sub>0</sub> and ID<sub>1</sub> bytes in command description 0x01</em><br>
Resume pulse counter processing after suspend command 0x04<br>
<em>Example</em> :</p>
<pre><code> (hex): 05 04 5A
</code></pre>
<p>See command 0x01.</p>
<h4 id="x06">0x06</h4>
<p><em>Description</em>: Set pulse width<br>
<em>Frame format</em>:</p>

<table>
<thead>
<tr>
<th align="center">0</th>
<th align="center">1</th>
<th align="center">2</th>
<th align="center">3</th>
<th align="center">…</th>
<th align="center">14</th>
</tr>
</thead>
<tbody>
<tr>
<td align="center">0x05</td>
<td align="center">ID<sub>1</sub></td>
<td align="center">ID<sub>0</sub></td>
<td align="center">WIDTH</td>
<td align="center">WIDTH</td>
<td align="center">WIDTH</td>
</tr>
</tbody>
</table><p><em>Explanations</em>:<br>
<em>See description of ID<sub>0</sub> and ID<sub>1</sub> bytes in command description 0x01</em><br>
Resume pulse counter processing after suspend command 0x04</p>

<table>
<thead>
<tr>
<th align="center">WIDTH(hex)</th>
<th align="center">00</th>
<th align="center">01</th>
<th align="center">02</th>
<th align="center">03</th>
<th align="center">04</th>
<th align="center">05</th>
<th align="center">06</th>
<th align="center">07</th>
<th align="center">08</th>
<th align="center">09</th>
<th align="center">0A</th>
<th align="center">0B</th>
<th align="center">0C</th>
<th align="center">0D</th>
<th align="center">0E</th>
<th align="center">0F</th>
</tr>
</thead>
<tbody>
<tr>
<td align="center">Pulse width (ms)</td>
<td align="center">250</td>
<td align="center">500</td>
<td align="center">750</td>
<td align="center">1000</td>
<td align="center">1250</td>
<td align="center">1500</td>
<td align="center">1750</td>
<td align="center">2000</td>
<td align="center">2250</td>
<td align="center">2500</td>
<td align="center">2750</td>
<td align="center">3000</td>
<td align="center">3250</td>
<td align="center">3500</td>
<td align="center">3750</td>
<td align="center">4000</td>
</tr>
</tbody>
</table><p><em>Example</em> :</p>
<pre><code> (hex): 06 04 5A 01 03 05 07 03
</code></pre>

<table>
<thead>
<tr>
<th align="center">data</th>
<th align="left">description</th>
</tr>
</thead>
<tbody>
<tr>
<td align="center"><code>06</code></td>
<td align="left">CMD</td>
</tr>
<tr>
<td align="center"><code>04</code></td>
<td align="left">line ID<sub>10</sub></td>
</tr>
<tr>
<td align="center"><code>5A</code></td>
<td align="left">lines ID<sub>6,4,3,1</sub></td>
</tr>
<tr>
<td align="center"><code>01</code></td>
<td align="left">500 ms for line ID<sub>1</sub></td>
</tr>
<tr>
<td align="center"><code>03</code></td>
<td align="left">1000 ms for line ID<sub>3</sub></td>
</tr>
<tr>
<td align="center"><code>05</code></td>
<td align="left">1500 ms for line ID<sub>4</sub></td>
</tr>
<tr>
<td align="center"><code>07</code></td>
<td align="left">2000 ms for line ID<sub>6</sub></td>
</tr>
<tr>
<td align="center"><code>03</code></td>
<td align="left">1000 ms for line ID<sub>10</sub></td>
</tr>
</tbody>
</table><h3 id="responses">Responses</h3>
<p><em>Frame formats are given without CRC32 bytes.</em></p>
<h4 id="x00-1">0x00</h4>
<p><em>Reserved</em></p>
<h4 id="x01-1">0x01</h4>
<p><em>Description</em>: Pulse counters.</p>

<table>
<thead>
<tr>
<th align="center">0</th>
<th align="center">1</th>
<th align="center">2</th>
<th align="center">3</th>
<th align="center">4</th>
<th align="center">…</th>
<th align="center">27</th>
<th align="center">28</th>
</tr>
</thead>
<tbody>
<tr>
<td align="center">0x01</td>
<td align="center">ID<sub>1</sub></td>
<td align="center">ID<sub>0</sub></td>
<td align="center">N[1]</td>
<td align="center">N[0]</td>
<td align="center">…</td>
<td align="center">N[1]</td>
<td align="center">N[0]</td>
</tr>
</tbody>
</table><p><em>Explanations</em>:<br>
It is returned after each sending of the pulse. Contains the current states of the pulse counters.<br>
<em>Also see command 0x01.</em></p>
<h4 id="x02-1">0x02</h4>
<p><em>Description</em>: Measured current in 8 bit representation for lines.</p>

<table>
<thead>
<tr>
<th align="center">0</th>
<th align="center">1</th>
<th align="center">2</th>
<th align="center">3</th>
<th align="center">…</th>
<th align="center">14</th>
</tr>
</thead>
<tbody>
<tr>
<td align="center">0x02</td>
<td align="center">ID<sub>1</sub></td>
<td align="center">ID<sub>0</sub></td>
<td align="center">I<sup>8bit</sup><sub>ma</sub></td>
<td align="center">I<sup>8bit</sup><sub>ma</sub></td>
<td align="center">I<sup>8bit</sup><sub>ma</sub></td>
</tr>
</tbody>
</table><p><em>Explanations</em>:<br>
It is returned after each sending of the pulse. Contains an 8-bit representation of the current received from the current sensor of each line.<br>
ID<sub>12</sub> corresponds to the total current consumption received from the total current sensor. ID<sub>12</sub> is transmitted in a separate frame.<br>
<em>Also see command 0x01.</em></p>

