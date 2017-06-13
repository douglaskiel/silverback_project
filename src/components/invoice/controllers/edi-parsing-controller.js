(function(window, angular, undefined) {
	angular.module('app');

		$scope.incomingEdi = [];

		function addressParse(arry) {
		console.log(arry);
		address = {};
		for (var i in arry) {
			if (arry[i].includes('N3')) {
				address.name = (arry[i].slice(0, -3));
			}
			if (arry[i].includes('N4')) {
				i = parseInt(i);
				address.address = (arry[i].slice(0, -3));
				address.city = arry[i+1];
				address.state = arry[i+2];
				address.zipcode = arry[i+3];
			}
			if(arry[i].includes('ATTN:')){
				address.attention = arry[i];
			}
		}
	
		return address;
		}
		
		router.put('/test_parse', function(req, res) {
		var text = "ISA*00* *00* *02*RDWY *01*123456789 *970113*1410*U*00300*000000001*0*P*> GS*IM*RDWY*123456789*20020401*1410*000000001*X*004010 ST*210*000000001 B3**2509121213*8000281336*PP**20020401*18304**20020401*017*RDWY N9*PO*SM12003301 G62*86*20020401 N1*CN*TRUE VALUE HARDWARE N3*1902 POPLAR ST N4*LEADVILLE*CO*80461 N1*SH*PENNZOIL – QUAKER STATE COMPANY N3*1601 S DIXIE HWY N4*LIMA*OH*45802 N1*BT*ANY PAY AGENT N3*ATTN: ELMA SMITH*PO BOX 17649 N4*ANYTOWN*MO*12345-6789 LX*1 L5*1*PETROLEUM OILS,*15525002*N L0*1***138*N***1*PLT**L L1*1*MIN*PH*18304 L7*1******0E60 LX*2 L3*138*G***18304******1 SE*0000000022*000000001 GE*000001*000000001 IEA*00001*000000001";
		var textSplit = text.split('*');
		var parsedObject = {
		ISA: textSplit[0],
		AuthInfoQualifier: textSplit[1],
		AuthInfo: textSplit[2],
		SecurityInfoQual: textSplit[3],
		SecurityInfo: textSplit[4],
		InterchangeIDQual1: textSplit[5],
		InterchangeSenderID: textSplit[6],
		InterchangeIDQual2: textSplit[7],
		InterchangeReceiverID: textSplit[8],
		InterchangeDate1: textSplit[9],
		InterchangeTime1: textSplit[10],
		InterchangeCtrlID: textSplit[11],
		InterchangeVersionID: textSplit[12],
		InterchangeCtrlNum1: textSplit[13],
		AcknowledgementReq: textSplit[14],
		TestIndicator: textSplit[15],
		SubelementSeperator: textSplit[16],
		// IncludedGroupNum: textSplit[17],
		// InterchangeCtrlNum2: textSplit[18],
		// CommID: textSplit[18],
		// CommPass: textSplit[19],
		// AppSenderCode: textSplit[20],
		// AppReceiverCode: textSplit[21],
		// DataInterchangeDate: textSplit[20],
		// DataInterchangeTime: textSplit[21],
		// TransmissionCtrlNum: textSplit[22],
		FunctionGroupID: textSplit[17],
		ApplicationSenderID: textSplit[18],
		ApplicationReceiverID: textSplit[19],
		InterchangeDate2: textSplit[20],
		InterchangeTime2: textSplit[21],
		GroupControlNum: textSplit[22],
		ResponseAgencyCode: textSplit[23],
		StandardsVersion: textSplit[24],
		TransactionSetID: textSplit[25],
		TransactionSetCtrlNum: textSplit[26]
	
		};
		console.log(textSplit);
		console.log(parsedObject);
		return;
	});
});