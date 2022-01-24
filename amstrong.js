	function Armstrong()
	{
		var flag,number,remainder,addition = 0;
		number = 153;
		flag = number;
		while(number > 0)
		{
			remainder = number%10;
			addition = addition + remainder*remainder*remainder;
			number = parseInt(number/10);
		}

		if(addition == flag)
		{
			console.log("-The inputed number is Armstrong");
		}

		else
		{
			console.log("-The inputed number is not Armstrong");
		}
	}
console.log();