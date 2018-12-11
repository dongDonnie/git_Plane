var NetData = module.exports;

NetData.NetReadInt8 = function(byteBuffer, ret) {
    if(byteBuffer.offset + 1 > byteBuffer.limit){
        ret.err = true;
        return 0;
    }

    ret.err = false;
    return byteBuffer.readInt8();
}

NetData.NetReadUint8 = function(byteBuffer, ret) {
    if(byteBuffer.offset + 1 > byteBuffer.limit){
        ret.err = true;
        return 0;
    }

    ret.err = false;
    return byteBuffer.readUint8();
}

NetData.NetReadInt16 = function(byteBuffer, ret) {
    if(byteBuffer.offset + 2 > byteBuffer.limit){
        ret.err = true;
        return 0;
    }

    ret.err = false;
    return byteBuffer.readInt16();
}

NetData.NetReadUint16 = function(byteBuffer, ret) {
    if(byteBuffer.offset + 2 > byteBuffer.limit){
        ret.err = true;
        return 0;
    }

    ret.err = false;
    return byteBuffer.readUint16();
}

NetData.NetReadInt32 = function(byteBuffer, ret) {
    if(byteBuffer.offset + 4 > byteBuffer.limit){
        ret.err = true;
        return 0;
    }

    ret.err = false;
    return byteBuffer.readInt32();
}

NetData.NetReadUint32 = function(byteBuffer, ret) {
    if(byteBuffer.offset + 4 > byteBuffer.limit){
        ret.err = true;
        return 0;
    }

    ret.err = false;
    return byteBuffer.readUint32();
}

NetData.NetReadInt64 = function(byteBuffer, ret) {
    if(byteBuffer.offset + 8 > byteBuffer.limit){
        ret.err = true;
        return 0;
    }

    ret.err = false;
    return byteBuffer.readInt64().toNumber();
}

NetData.NetReadUint64 = function(byteBuffer, ret) {
    if(byteBuffer.offset + 8 > byteBuffer.limit){
        ret.err = true;
        return 0;
    }

    ret.err = false;
    return byteBuffer.readUint64().toNumber();
}

NetData.NetWriteInt8 = function(n, byteBuffer) {
    if(null == n){
        byteBuffer.writeInt8(0);
    }else{
        byteBuffer.writeInt8(parseInt(n));
    }
    
    return true;
}

NetData.NetWriteUint8 = function(n, byteBuffer) {
    if(null == n){
        byteBuffer.writeUint8(0);
    }else{
        byteBuffer.writeUint8(parseInt(n));
    }
    
    return true;
}

NetData.NetWriteInt16 = function(n, byteBuffer) {
    if(null == n){
        byteBuffer.writeInt16(0);
    }else{
        byteBuffer.writeInt16(parseInt(n));
    }
    
    return true;
}

NetData.NetWriteUint16 = function(n, byteBuffer) {
    if(null == n){
        byteBuffer.writeUint16(0);
    }else{
        byteBuffer.writeUint16(parseInt(n));
    }
    
    return true;
}

NetData.NetWriteInt32 = function(n, byteBuffer) {

    if(null == n){
        byteBuffer.writeInt32(0);
    }else{
        byteBuffer.writeInt32(parseInt(n))
    }
    
    return true;
}

NetData.NetWriteUint32 = function(n, byteBuffer) {

    if(null == n){
        byteBuffer.writeUint32(0);
    }else{
        byteBuffer.writeUint32(parseInt(n));
    }
    
    return true;
}

NetData.NetWriteInt64 = function(n, byteBuffer) {
    if(null == n){
        byteBuffer.writeInt64(0);
    }else{
        byteBuffer.writeInt64(parseInt(n));
    }
    
    return true;
}

NetData.NetWriteUint64 = function(n, byteBuffer) {
    if(null == n){
        byteBuffer.writeUint64(0);
    }else{
        byteBuffer.writeUint64(parseInt(n));
    }
    
    return true;
}

NetData.NetReadString = function(byteBuffer, maxLen, ret) {
    if(byteBuffer.offset + 4 > byteBuffer.limit){
        ret.err = true;
        return "";
    }
	
	let posLen = byteBuffer.offset;
    let str = byteBuffer.readIString();
    let posEnd = byteBuffer.offset;
	
	let strLen = posEnd-posLen-4;
    if(strLen >= maxLen){
		ret.err = true;
        return "";
    }

	ret.err = false;
    return str;
}

NetData.NetWriteString = function(str, maxLen, byteBuffer) {
    if(null == str){
        byteBuffer.writeInt(0);
        return true;
    }

    let posLen = byteBuffer.offset;
    byteBuffer.writeIString(str);
    let posEnd = byteBuffer.offset;

    let strLen = posEnd-posLen-4;
    if(strLen >= maxLen){
        return false;
    }

    return true;
}

NetData.NetHeaderCheckSum = function(dwDataLen, wMsgID) {
    let byLenSum = ((dwDataLen & 0xff000000) >> 24) ^ ((dwDataLen & 0x00ff0000) >> 16) ^ ((dwDataLen & 0x0000ff00) >> 8) ^ ((dwDataLen & 0x000000ff));
    let byMsgSum = ((wMsgID & 0xff00) >> 8) ^ (wMsgID & 0x00ff);
    return (byLenSum ^ byMsgSum ^ 0x3f);
}

NetData.ParsePacket = function(byteBuffer, byteBufferLen) {
    if(byteBuffer.offset + 8 > byteBufferLen){
        return 0;
    }

    let posBackup = byteBuffer.offset;

    byteBuffer.BE(true);
    let flag = byteBuffer.readByte();
    let checkSum = byteBuffer.readByte();
    let msgId = byteBuffer.readUnsignedShort();
    let dataLen = byteBuffer.readUnsignedInt();
    byteBuffer.offset = posBackup;

    if(flag != 0xb0){
        return -1;
    }

    if(NetHeaderCheckSum(dataLen, msgId) != checkSum){
        return -1;
    }

    if(byteBuffer.offset + dataLen + 8 > byteBufferLen){
        return 0;
    }

    return dataLen+8;
}
