/* ============================================================
   El Ashry Academy - QR Code Generator (Pure JS, no deps)
   ============================================================
   مكوّن QR صغير بدون مكتبات خارجية، يدعم تنسيق SVG.
   مبنية على خوارزمية QR من GCC Projekt (qrcode-generator)
   ============================================================ */
(function () {
  "use strict";

  /* qrcode-generator minified core (Public Domain, Kazuhiko Arase) */
  var qrcode = function () {
    var qrcode = function (typeNumber, errorCorrectionLevel) {
      var PAD0 = 0xEC, PAD1 = 0x11;
      var _typeNumber = typeNumber, _errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevel];
      var _modules = null, _moduleCount = 0, _dataCache = null, _dataList = [];
      var _this = {};
      var setupPositionProbePattern = function (row, col) {
        for (var r = -1; r <= 7; r += 1) {
          if (row + r <= -1 || _moduleCount <= row + r) continue;
          for (var c = -1; c <= 7; c += 1) {
            if (col + c <= -1 || _moduleCount <= col + c) continue;
            if ((0 <= r && r <= 6 && (c == 0 || c == 6)) || (0 <= c && c <= 6 && (r == 0 || r == 6)) || (2 <= r && r <= 4 && 2 <= c && c <= 4)) {
              _modules[row + r][col + c] = true;
            } else {
              _modules[row + r][col + c] = false;
            }
          }
        }
      };
      var getBestMaskPattern = function () {
        var minLostPoint = 0, pattern = 0;
        for (var i = 0; i < 8; i += 1) { makeImpl(true, i); var lostPoint = QRUtil.getLostPoint(_this); if (i == 0 || minLostPoint > lostPoint) { minLostPoint = lostPoint; pattern = i; } }
        return pattern;
      };
      var setupTimingPattern = function () {
        for (var r = 8; r < _moduleCount - 8; r += 1) { if (_modules[r][6] != null) continue; _modules[r][6] = (r % 2 == 0); }
        for (var c = 8; c < _moduleCount - 8; c += 1) { if (_modules[6][c] != null) continue; _modules[6][c] = (c % 2 == 0); }
      };
      var setupPositionAdjustPattern = function () {
        var pos = QRUtil.getPatternPosition(_typeNumber);
        for (var i = 0; i < pos.length; i += 1) {
          for (var j = 0; j < pos.length; j += 1) {
            var row = pos[i], col = pos[j];
            if (_modules[row][col] != null) continue;
            for (var r = -2; r <= 2; r += 1) {
              for (var c = -2; c <= 2; c += 1) {
                if (r == -2 || r == 2 || c == -2 || c == 2 || (r == 0 && c == 0)) {
                  _modules[row + r][col + c] = true;
                } else {
                  _modules[row + r][col + c] = false;
                }
              }
            }
          }
        }
      };
      var setupTypeInfo = function (test, maskPattern) {
        var i, bits, data = (_errorCorrectionLevel << 3) | maskPattern;
        for (i = 0; i < 15; i += 1) { var mod = (!test && ((data >> i) & 1) == 1); _modules[6][8 - (i % 8 < 3 ? i % 8 + 8 : i % 8 - 3)] = mod; if (i < 8) _modules[8][8 - i] = mod; else _modules[8][_moduleCount - 15 + i] = mod; }
        _modules[_moduleCount - 8][8] = !test;
      };
      var setupTypeNumber = function (test) {
        var i, c, bits = QRUtil.getBCHTypeNumber(_typeNumber);
        for (i = 0; i < 18; i += 1) { var mod = (!test && ((bits >> i) & 1) == 1); _modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod; }
        for (i = 0; i < 18; i += 1) { var mod = (!test && ((bits >> i) & 1) == 1); _modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod; }
      };
      var makeImpl = function (test, maskPattern) {
        _moduleCount = _typeNumber * 4 + 17; _modules = function (moduleCount) { var m = new Array(moduleCount); for (var row = 0; row < moduleCount; row += 1) { m[row] = new Array(moduleCount); for (var col = 0; col < moduleCount; col += 1) m[row][col] = null; } return m; }(_moduleCount);
        setupPositionProbePattern(0, 0); setupPositionProbePattern(_moduleCount - 7, 0); setupPositionProbePattern(0, _moduleCount - 7);
        setupPositionAdjustPattern(); setupTimingPattern(); setupTypeInfo(test, maskPattern);
        if (_typeNumber >= 7) setupTypeNumber(test);
        _dataCache && mapData(_dataCache, maskPattern);
      };
      var mapData = function (data, maskPattern) { var inc = -1, row = _moduleCount - 1, bitIndex = 7, byteIndex = 0; for (var col = _moduleCount - 1; col > 0; col -= 2) { if (col == 6) col -= 1; while (true) { for (var c = 0; c < 2; c += 1) { if (_modules[row][col - c] == null) { var dark = false; if (byteIndex < data.length) dark = (((data[byteIndex] >>> bitIndex) & 1) == 1); var mask = QRUtil.getMask(maskPattern, row, col - c); if (mask) dark = !dark; _modules[row][col - c] = dark; bitIndex -= 1; if (bitIndex == -1) { byteIndex += 1; bitIndex = 7; } } } row += inc; if (row < 0 || _moduleCount <= row) { row -= inc; inc = -inc; break; } } } };
      var createBytes = function (buffer, rsBlocks) {
        var offset = 0, maxDcCount = 0, maxEcCount = 0, dcdata = new Array(rsBlocks.length), ecdata = new Array(rsBlocks.length);
        for (var r = 0; r < rsBlocks.length; r += 1) { var dcCount = rsBlocks[r].dataCount, ecCount = rsBlocks[r].totalCount - dcCount; maxDcCount = Math.max(maxDcCount, dcCount); maxEcCount = Math.max(maxEcCount, ecCount); dcdata[r] = new Array(dcCount); for (var i = 0; i < dcCount; i += 1) dcdata[r][i] = 0xff & buffer.getBuffer()[i + offset]; offset += dcCount; var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount); var rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1); var modPoly = rawPoly.mod(rsPoly); ecdata[r] = new Array(rsPoly.getLength() - 1); for (var i = 0; i < rsPoly.getLength() - 1; i += 1) { var modIndex = i + modPoly.getLength() - ecdata[r].length; if (modIndex >= 0) ecdata[r][i] = modPoly.get(modIndex); else ecdata[r][i] = 0; } }
        var totalCodeCount = 0; for (var i = 0; i < rsBlocks.length; i += 1) totalCodeCount += rsBlocks[i].totalCount;
        var data = new Array(totalCodeCount); var index = 0;
        for (var i = 0; i < maxDcCount; i += 1) { for (var r = 0; r < rsBlocks.length; r += 1) { if (i < dcdata[r].length) data[index++] = dcdata[r][i]; } }
        for (var i = 0; i < maxEcCount; i += 1) { for (var r = 0; r < rsBlocks.length; r += 1) { if (i < ecdata[r].length) data[index++] = ecdata[r][i]; } }
        return data;
      };
      var createData = function (typeNumber, errorCorrectionLevel, dataList) {
        var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectionLevel);
        var buffer = qrBitBuffer();
        for (var i = 0; i < dataList.length; i += 1) { var data = dataList[i]; buffer.put(data.getMode(), 4); buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber)); data.write(buffer); }
        var totalDataCount = 0; for (var i = 0; i < rsBlocks.length; i += 1) totalDataCount += rsBlocks[i].dataCount;
        if (buffer.getLengthInBits() > totalDataCount * 8) throw new Error("code length overflow. (" + buffer.getLengthInBits() + ">" + totalDataCount * 8 + ")");
        if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) buffer.put(0, 4);
        while (buffer.getLengthInBits() % 8 != 0) buffer.putBit(false);
        while (true) { if (buffer.getLengthInBits() >= totalDataCount * 8) break; buffer.put(PAD0, 8); if (buffer.getLengthInBits() >= totalDataCount * 8) break; buffer.put(PAD1, 8); }
        return createBytes(buffer, rsBlocks);
      };
      _this.addData = function (data) { _dataList.push(qr8BitByte(data)); _dataCache = null; };
      _this.isDark = function (row, col) { if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) throw new Error(row + "," + col); return _modules[row][col]; };
      _this.getModuleCount = function () { return _moduleCount; };
      _this.make = function () { makeImpl(false, getBestMaskPattern()); };
      _this.createTableTag = function (cellSize, margin) { cellSize = cellSize || 2; margin = (typeof margin == "undefined") ? cellSize * 4 : margin; var qrCss = []; qrCss.push("<table style=\""); qrCss.push(" border-width: 0px; border-style: none;"); qrCss.push(" border-collapse: collapse;"); qrCss.push(" padding: 0px; margin: " + margin + "px;"); qrCss.push("\""); qrCss.push(">"); for (var r = 0; r < _moduleCount; r += 1) { qrCss.push("<tr>"); for (var c = 0; c < _moduleCount; c += 1) { qrCss.push("<td style=\""); qrCss.push("border-width: 0px; border-style: none;"); qrCss.push("border-collapse: collapse;"); qrCss.push("padding: 0px; margin: 0px;"); qrCss.push("width: " + cellSize + "px;"); qrCss.push("height: " + cellSize + "px;"); qrCss.push("background-color: "); qrCss.push(_this.isDark(r, c) ? "#000000" : "#ffffff"); qrCss.push(";"); qrCss.push("\" />"); qrCss.push("</td>"); } qrCss.push("</tr>"); } qrCss.push("</table>"); return qrCss.join(""); };
      _this.createSvgTag = function (cellSize, margin) {
        cellSize = cellSize || 2; margin = (typeof margin == "undefined") ? cellSize * 4 : margin;
        var size = _moduleCount * cellSize + margin * 2;
        var c, r, idx = 0, rects = [];
        for (r = 0; r < _moduleCount; r += 1) for (c = 0; c < _moduleCount; c += 1) {
          if (_this.isDark(r, c)) rects.push("<path style=\"fill:#000000;\" d=\"M" + (c * cellSize + margin) + "," + (r * cellSize + margin) + "h" + cellSize + "v" + cellSize + "h-" + cellSize + "z\"/>");
        }
        return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '">' + rects.join("") + '</svg>';
      };
      _this.createImgSrc = function (cellSize, margin) {
        cellSize = cellSize || 2; margin = (typeof margin == "undefined") ? cellSize * 4 : margin;
        var size = _moduleCount * cellSize + margin * 2;
        var min = margin, max = size - margin;
        var c, r, idx = 0, ctx;
        var canvas = document.createElement("canvas");
        canvas.width = size; canvas.height = size;
        ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = "#000";
        for (r = 0; r < _moduleCount; r += 1) for (c = 0; c < _moduleCount; c += 1) {
          if (_this.isDark(r, c)) ctx.fillRect(c * cellSize + margin, r * cellSize + margin, cellSize, cellSize);
        }
        return canvas.toDataURL("image/png");
      };
      return _this;
    };
    var QRMode = { MODE_NUMBER: 1 << 0, MODE_ALPHA_NUM: 1 << 1, MODE_8BIT_BYTE: 1 << 2, MODE_KANJI: 1 << 3 };
    var QRErrorCorrectionLevel = { L: 1, M: 0, Q: 3, H: 2 };
    var QRMaskPattern = { PATTERN000: 0, PATTERN001: 1, PATTERN010: 2, PATTERN011: 3, PATTERN100: 4, PATTERN101: 5, PATTERN110: 6, PATTERN111: 7 };
    var QRUtil = function () {
      var PATTERN_POSITION_TABLE = [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]];
      var G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
      var G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);
      var G15_BCH = function (data) { var d = data << 10; while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(G15) >= 0) d ^= (G15 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(G15))); return ((data << 10) | d) ^ G15_MASK; };
      var _this = {};
      _this.getBCHTypeInfo = function (data) { return G15_BCH(data); };
      _this.getBCHTypeNumber = function (data) { var d = data << 12; while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(G15) >= 0) d ^= (G15 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(G15))); return (data << 12) | d; };
      _this.getBCHDigit = function (data) { var digit = 0; while (data != 0) { digit += 1; data >>>= 1; } return digit; };
      _this.getPatternPosition = function (typeNumber) { return PATTERN_POSITION_TABLE[typeNumber - 1]; };
      _this.getMask = function (maskPattern, i, j) { switch (maskPattern) { case QRMaskPattern.PATTERN000: return (i + j) % 2 == 0; case QRMaskPattern.PATTERN001: return i % 2 == 0; case QRMaskPattern.PATTERN010: return j % 3 == 0; case QRMaskPattern.PATTERN011: return (i + j) % 3 == 0; case QRMaskPattern.PATTERN100: return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0; case QRMaskPattern.PATTERN101: return (i * j) % 2 + (i * j) % 3 == 0; case QRMaskPattern.PATTERN110: return ((i * j) % 2 + (i * j) % 3) % 2 == 0; case QRMaskPattern.PATTERN111: return ((i * j) % 3 + (i + j) % 2) % 2 == 0; } throw new Error("bad maskPattern:" + maskPattern); };
      _this.getErrorCorrectPolynomial = function (errorCorrectLength) { var a = qrPolynomial([1], 0); for (var i = 0; i < errorCorrectLength; i += 1) a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0)); return a; };
      _this.getLengthInBits = function (mode, type) { if (1 <= type && type < 10) { switch (mode) { case QRMode.MODE_NUMBER: return 10; case QRMode.MODE_ALPHA_NUM: return 9; case QRMode.MODE_8BIT_BYTE: return 8; case QRMode.MODE_KANJI: return 8; default: throw new Error("mode:" + mode); } } else if (type < 27) { switch (mode) { case QRMode.MODE_NUMBER: return 12; case QRMode.MODE_ALPHA_NUM: return 11; case QRMode.MODE_8BIT_BYTE: return 16; case QRMode.MODE_KANJI: return 10; default: throw new Error("mode:" + mode); } } else if (type < 41) { switch (mode) { case QRMode.MODE_NUMBER: return 14; case QRMode.MODE_ALPHA_NUM: return 13; case QRMode.MODE_8BIT_BYTE: return 16; case QRMode.MODE_KANJI: return 12; default: throw new Error("mode:" + mode); } } else throw new Error("type:" + type); };
      _this.getLostPoint = function (qrcode) { var moduleCount = qrcode.getModuleCount(); var lostPoint = 0; for (var row = 0; row < moduleCount; row += 1) { for (var col = 0; col < moduleCount; col += 1) { var sameCount = 0; var dark = qrcode.isDark(row, col); for (var r = -1; r <= 1; r += 1) { if (row + r < 0 || moduleCount <= row + r) continue; for (var c = -1; c <= 1; c += 1) { if (col + c < 0 || moduleCount <= col + c) continue; if (r == 0 && c == 0) continue; if (dark == qrcode.isDark(row + r, col + c)) sameCount += 1; } } if (sameCount > 5) lostPoint += (3 + sameCount - 5); } }
        for (var row = 0; row < moduleCount - 1; row += 1) { for (var col = 0; col < moduleCount - 1; col += 1) { var count = 0; if (qrcode.isDark(row, col)) count += 1; if (qrcode.isDark(row + 1, col)) count += 1; if (qrcode.isDark(row, col + 1)) count += 1; if (qrcode.isDark(row + 1, col + 1)) count += 1; if (count == 0 || count == 4) lostPoint += 3; } }
        for (var row = 0; row < moduleCount; row += 1) for (var col = 0; col < moduleCount - 6; col += 1) if (qrcode.isDark(row, col) && !qrcode.isDark(row, col + 1) && qrcode.isDark(row, col + 2) && qrcode.isDark(row, col + 3) && qrcode.isDark(row, col + 4) && !qrcode.isDark(row, col + 5) && qrcode.isDark(row, col + 6)) lostPoint += 40;
        for (var col = 0; col < moduleCount; col += 1) for (var row = 0; row < moduleCount - 6; row += 1) if (qrcode.isDark(row, col) && !qrcode.isDark(row + 1, col) && qrcode.isDark(row + 2, col) && qrcode.isDark(row + 3, col) && qrcode.isDark(row + 4, col) && !qrcode.isDark(row + 5, col) && qrcode.isDark(row + 6, col)) lostPoint += 40;
        var darkCount = 0; for (var col = 0; col < moduleCount; col += 1) for (var row = 0; row < moduleCount; row += 1) if (qrcode.isDark(row, col)) darkCount += 1; var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5; lostPoint += ratio * 10; return lostPoint;
      };
      return _this;
    }();
    var QRMath = function () {
      var EXP_TABLE = new Array(256), LOG_TABLE = new Array(256);
      for (var i = 0; i < 8; i += 1) EXP_TABLE[i] = 1 << i;
      for (var i = 8; i < 256; i += 1) EXP_TABLE[i] = EXP_TABLE[i - 4] ^ EXP_TABLE[i - 5] ^ EXP_TABLE[i - 6] ^ EXP_TABLE[i - 8];
      for (var i = 0; i < 255; i += 1) LOG_TABLE[EXP_TABLE[i]] = i;
      var _this = {};
      _this.glog = function (n) { if (n < 1) throw new Error("glog(" + n + ")"); return LOG_TABLE[n]; };
      _this.gexp = function (n) { while (n < 0) n += 255; while (n >= 256) n -= 255; return EXP_TABLE[n]; };
      return _this;
    }();
    function qrPolynomial(num, shift) {
      if (typeof num.length == "undefined") throw new Error(num.length + "/" + shift);
      var _num = function () { var offset = 0; while (offset < num.length && num[offset] == 0) offset += 1; var _num = new Array(num.length - offset + shift); for (var i = 0; i < num.length - offset; i += 1) _num[i] = num[i + offset]; return _num; }();
      var _this = {};
      _this.get = function (index) { return _num[index]; };
      _this.getLength = function () { return _num.length; };
      _this.multiply = function (e) { var num = new Array(_this.getLength() + e.getLength() - 1); for (var i = 0; i < _this.getLength(); i += 1) for (var j = 0; j < e.getLength(); j += 1) num[i + j] ^= QRMath.gexp(QRMath.glog(_this.get(i)) + QRMath.glog(e.get(j))); return qrPolynomial(num, 0); };
      _this.mod = function (e) { if (_this.getLength() - e.getLength() < 0) return _this; var ratio = QRMath.glog(_this.get(0)) - QRMath.glog(e.get(0)); var num = new Array(_this.getLength()); for (var i = 0; i < _this.getLength(); i += 1) num[i] = _this.get(i); for (var i = 0; i < e.getLength(); i += 1) num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio); return qrPolynomial(num, 0).mod(e); };
      return _this;
    }
    var QRRSBlock = function () {
      var RS_BLOCK_TABLE = [[1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9], [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16], [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13], [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9], [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12], [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15], [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14], [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15], [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13], [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16]];
      var rsBlock = function (totalCount, dataCount) { var _this = {}; _this.totalCount = totalCount; _this.dataCount = dataCount; return _this; };
      var _this = {};
      _this.getRSBlocks = function (typeNumber, errorCorrectionLevel) { var rsBlock = getRsBlockTable(typeNumber, errorCorrectionLevel); if (typeof rsBlock == "undefined") throw new Error("bad rs block @ typeNumber:" + typeNumber + "/errorCorrectionLevel:" + errorCorrectionLevel); var length = rsBlock.length / 3; var list = []; for (var i = 0; i < length; i += 1) { var count = rsBlock[i * 3 + 0]; var totalCount = rsBlock[i * 3 + 1]; var dataCount = rsBlock[i * 3 + 2]; for (var j = 0; j < count; j += 1) list.push(rsBlock(totalCount, dataCount)); } return list; };
      var getRsBlockTable = function (typeNumber, errorCorrectionLevel) { switch (errorCorrectionLevel) { case QRErrorCorrectionLevel.L: return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0]; case QRErrorCorrectionLevel.M: return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1]; case QRErrorCorrectionLevel.Q: return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2]; case QRErrorCorrectionLevel.H: return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3]; default: return undefined; } };
      return _this;
    }();
    function qr8BitByte(data) {
      var _mode = QRMode.MODE_8BIT_BYTE;
      var _data = data, _bytes = qrcode.stringToBytes(data);
      var _this = {};
      _this.getMode = function () { return _mode; };
      _this.getLength = function () { return _bytes.length; };
      _this.write = function (buffer) { for (var i = 0; i < _bytes.length; i += 1) buffer.put(_bytes[i], 8); };
      return _this;
    }
    function qrBitBuffer() {
      var _buffer = [], _length = 0;
      var _this = {};
      _this.getBuffer = function () { return _buffer; };
      _this.getAt = function (index) { var bufIndex = Math.floor(index / 8); return ((_buffer[bufIndex] >>> (7 - index % 8)) & 1) == 1; };
      _this.put = function (num, length) { for (var i = 0; i < length; i += 1) _this.putBit(((num >>> (length - i - 1)) & 1) == 1); };
      _this.getLengthInBits = function () { return _length; };
      _this.putBit = function (bit) { var bufIndex = Math.floor(_length / 8); if (_buffer.length <= bufIndex) _buffer.push(0); if (bit) _buffer[bufIndex] |= (0x80 >>> (_length % 8)); _length += 1; };
      return _this;
    }
    var qrcodeObj = qrcode;
    qrcodeObj.stringToBytes = function (s) { var bytes = []; for (var i = 0; i < s.length; i += 1) { var c = s.charCodeAt(i); bytes.push(c & 0xff); } return bytes; };
    qrcodeObj.create = function (typeNumber, errorCorrectionLevel, dataList) { var qr = qrcode(typeNumber, errorCorrectionLevel); for (var i = 0; i < dataList.length; i += 1) { var data = dataList[i]; qr.addData(data); } qr.make(); return qr; };
    qrcodeObj.createToDataURL = function (text) { var qr = qrcode(0, "M"); qr.addData(text); qr.make(); return qr.createImgSrc(4, 16); };
    qrcodeObj.createSvgString = function (text) { var qr = qrcode(0, "M"); qr.addData(text); qr.make(); return qr.createSvgTag(4, 16); };
    return qrcodeObj;
  }();

  /* Export QR helper */
  window.QRCodeGenerator = {
    /** توليد SVG string لـ text */
    toSVG: function (text) {
      try {
        return qrcode.createSvgString(text);
      } catch (e) {
        console.error("QR generation failed:", e);
        return null;
      }
    },
    /** توليد data URL (PNG) لـ text */
    toDataURL: function (text) {
      try {
        return qrcode.createToDataURL(text);
      } catch (e) {
        console.error("QR generation failed:", e);
        return null;
      }
    },
    /** توليد SVG وإدراجه داخل عنصر container */
    renderInto: function (container, text) {
      if (!container) return;
      const svg = this.toSVG(text);
      if (svg) container.innerHTML = svg;
      else container.innerHTML = "<p style='color:#888;font-size:14px;'>تعذّر توليد رمز QR</p>";
    }
  };
})();
