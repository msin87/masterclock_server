const NVRAM_IO ={
    write: data => console.log(data),
    read: () => 0x0005011002150320042505300635
};

const nvramAPI = () => ({
    writeLinesTime: linesTime=>{
        let data = linesTime.reduce((acc,val)=>acc+'\\\\x'+val.split(':')[0]+'\\\\x'+val.split(':')[1],'');
        NVRAM_IO.write(data);
    },
    readClockLines: () => {
        let data=NVRAM_IO.read();

    }
})
