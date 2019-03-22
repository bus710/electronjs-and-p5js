/* irb manages the connection with serialports.
    Also, parses the incoming stream as IRB command. */

const SerialPort = require("serialport");
const EventEmitter = require("events");

class NodeIrb extends EventEmitter {
    constructor(targetPort) {
        super();

        this.targetPort = targetPort;

        this.port = new SerialPort(this.targetPort, {
            autoOpen: false,
            baudRate: 115200
        });
        this.port.on('open', () => this.portOpened());
        this.port.on('data', (data) => this.portRead(data));
        this.port.on('close', () => this.portClosed());
        this.port.on('disconnect', () => this.portDisconnected());

        this.port.open((err) => {
            if (err) {
                this.emit('portOpenFailed');
                this.targetPort = null;
                this.port = null;
            }
        });

        this.prevData = [];
    }

    portOpened() {
        // console.log('port opened');
        this.emit('portOpened');
    }

    portRead(data) {
        // console.log('port read');
        let rawData = new Uint8Array(data.length);
        let splittedData = [];

        rawData.set(data);

        if (this.prevData.length != 0) {
            this.prevData = this.prevData + ',' + rawData;
            this.prevData += ',';

            rawData = this.prevData;
        }

        splittedData = rawData.toString().split("170,170");

        splittedData.forEach((v, i) => {
            /* Emit(send) it if long enough */
            if (v.split(',').length > 17) {
                // console.log(v.split(','))
                v = "170,170" + v;
                var ret = this.parseIRB(v);
                if (ret != "") {
                    this.prevData += ret;
                } else {
                    this.prevData = "";
                }
            } else if (i == (splittedData.length - 1)) {
                /* Store it if too short */
                this.prevData = "170,170" + splittedData[splittedData.length - 1];
            }
        });

        // messageLength = rawData[value + 16]
        // lrc = rawData[value + 16 + messageLength + 1]
        // message = rawData.slice(value + 16 + messageLength + 1)
    }

    parseIRB(data) {
        let irbRaw = data.split(',');

        /* This block removes the emplty string from the array. */
        if (irbRaw[0].length == 0) {
            irbRaw[0].pop();
        }

        for (let i = 0; i < irbRaw.length; i++) {
            if (irbRaw[i].length == 0) {
                irbRaw.pop(i);
                i = 0;
            }
        }

        if (irbRaw[irbRaw.length - 1].length == 0) {
            irbRaw.pop(irbRaw.length - 1);
        }
        if (irbRaw[irbRaw.length - 1].length == 0) {
            irbRaw.pop(irbRaw.length - 1);
        }

        let irbMessage = {
            dt1: 0,
            dt2: 0,
            dc: 0,
            fam: 0,
            seqID: 0,
            header: 0,
            amode: 0,
            sourceMAC: [],
            destinationMAC: [],
            functionCode: 0,
            functionCodeName: 'Unknown',
            len: 0,
            payload: [],
            lrc: 0,
        }

        if ((irbRaw[0] != '170') || (irbRaw[1] != '170')) {
            /* Preambles are not matched to 0xAA and 0xAA 
                for the first two bytes of the message. */
            // console.log("preamble unmatched")
            return irbRaw.toString();
        } else {
            /* No preamble error found */

            /* Generate the LRC byte. */
            for (let i = 4; i < irbRaw.length - 1; i++) {
                irbMessage.lrc = irbMessage.lrc ^ parseInt(irbRaw[i], 10);
            }

            /* Need to check LRC */
            if (irbMessage.lrc.toString() != irbRaw[irbRaw.length - 1]) {
                /* An LRC error found. 
                    The message shoud be passed and merged in the next iteration. */
                // console.log("lrc unmatched")
                // console.log(irbMessage.lrc)
                // console.log(irbRaw.toString())
                // console.log(data.toString())
                return irbRaw.toString();
            }

            /* Preables and LRC are good!
                Deserialize the incoming message into the object. */
            irbMessage.dt1 = irbRaw[2];
            irbMessage.dt2 = irbRaw[3];
            irbMessage.dc = irbRaw[4];
            irbMessage.fam = 0;
            irbMessage.amode = 0;
            irbMessage.ir = 0;
            irbMessage.seqID = irbRaw[6];
            irbMessage.sourceMAC = irbRaw.slice(7, 11);
            irbMessage.destinationMAC = irbRaw.slice(11, 15);
            irbMessage.functionCode = irbRaw[15];
            irbMessage.len = irbRaw[16];
            irbMessage.payload = irbRaw.slice(17, irbRaw.length - 1);

            irbMessage.functionCodeName = this.getFcName(irbMessage.functionCode);
            console.log(irbMessage.seqID + " / " +
                irbMessage.functionCode + " / " +
                irbMessage.functionCodeName);
            // console.log(irbMessage.seqID + " / " + 
            //             irbMessage.functionCode + " / " + 
            //             irbMessage.functionCodeName);
            this.emit('portData', irbMessage)
        }
        return "";
    }

    getFcName(functionCode) {
        switch (parseInt(functionCode, 10)) {
            case 0x01:
                return 'Arb Request';
            case 0x04:
                return 'PnG Request';
            case 0x05:
                return 'PnG Enter';
            case 0x06:
                return 'PnG Exit';
            case 0x08:
                return 'PnG Configure';
            case 0x10:
                return 'Set';
            case 0x13:
                return 'Mac Response';
            case 0x17:
                return 'Mac Report';
            case 0x27:
                return 'Load Ack';
            case 0x34:
                return 'Sensor Goto';
            case 0x3b:
                return 'Button ID';
            case 0x3a:
                return 'Button Query';
            case 0x43:
                return 'Load Ack Query';
            case 0x46:
                return 'Back to Factory';
            case 0x4b:
                return 'Power Monitor';
            case 0xff:
                return 'Test Message';
            default:
                return "Unknown";
        }
    }

    portWrite(data) {
        console.log('port write');

        var command = []
        data.split(',').forEach((a) => {
            command.push(parseInt(a, 10));
        })
        this.port.write(command);
    }

    portClosed() {
        // console.log('port closed');
        this.emit('portClosed');
        this.targetPort = null;
        this.port = null;
    }

    portDisconnected() {
        // console.log('port disconnected');
        this.emit('portDisconnected');
        this.targetPort = null;
        this.port = null;
    }

    portClose() {
        this.port.close();
    }
}

module.exports.NodeIrb = NodeIrb;