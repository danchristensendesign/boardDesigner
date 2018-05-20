
 var infVal = 50;
 function matrixSolver(xyPts, vertEnds)
 {
	var coeffs = [];
	var order = xyPts.length-1;
	console.log(xyPts);
	
	//add extra matrix rows for infinite slope at ends (if applicable)
	if(arguments.length > 1 && vertEnds === true)
	{
		order += 2;
		var curX = 1;
		var slope = infVal;
		for(var itr =0; itr < 2; itr += 1)
		{
			var tArr = [];
			for(var k = 0; k <= order; k +=1 )
			{
				if(k < order)
					tArr.push((order-k)*Math.pow(curX,order-1-k));
				else
					tArr.push(0);
			}
			tArr.push(slope);
			console.log(tArr);
			coeffs.push(tArr);
			curX = -1;
			slope = -infVal;
		}
	}
	console.log(coeffs);
	//add matrix rows for all points
	for(var i = 0; i < xyPts.length; i += 1)
	{
		var tArr = [];
		for(var k = 0; k <= order; k += 1)
		{
			tArr.push(Math.pow(xyPts[i][0],order-k));
		}
		tArr.push(xyPts[i][1]);
		coeffs.push(tArr);
	}
	console.log(coeffs);
	
	//make sure any line with a 0 in the first position is the last row (or my routine falls apart)
	for(var i = 0; i < order; i += 1)
	{
		if(coeffs[i][0] === 0)
		{
			var tArr = coeffs[i];
			coeffs.splice(i,1);
			coeffs.push(tArr);
			break;
		}
	}

console.log(coeffs);
	//lower diagonal
	for(var i = 0; i <= order; i += 1)
	{
		//set first column to 1's
		for(var j = i; j <= order; j += 1)
		{
			if(Math.abs(coeffs[j][i]) !== 0)
			{
				var mult = 1/coeffs[j][i];
				for(var k = i; k <= order+1; k += 1)
				{
					coeffs[j][k] *= mult;
				}
			}			
		}

		//set lower first columns to 0's
		for(var j=i+1; j <= order; j+=1)
		{
			if(Math.abs(coeffs[j][i]) !== 0)
			{
				for(var k = i; k <= order+1; k += 1)
				{
					coeffs[j][k] = -coeffs[j][k] + coeffs[i][k];
				}
			}
		}	
	}
	
	console.log(coeffs);

	//upper diagonal
	for(var i = order; i > 0; i -= 1)
	{
		//set last column to 1's
		for(var j = i-1; j >= 0; j -= 1)
		{
			if(Math.abs(coeffs[j][i]) !== 0)
			{
				var mult = -coeffs[j][i];
				for(var k = j+1; k <= order+1; k += 1)
				{
					coeffs[j][k] = coeffs[j][k] + mult * coeffs[i][k];
				}
			}
		}

	}

	console.log(coeffs);
	var sol = [];
	for(var i = 0; i <= order; i +=1)
		sol.push(coeffs[i][order+1]);
	
	//console.log(sol);
	return sol;
}

function getY(x, coeffs)
{
	var y=0;
	for(var i=0; i < coeffs.length; i +=1)
	{
		y += Math.pow(x,coeffs.length-1-i) * coeffs[i];
	}
	return y;
}

function rootSeek(lwrX, uprX, iterations, coeffs)
{
	var minY = .000000001;
	var uprY = getY(uprX,coeffs);
	var lwrY = getY(lwrX, coeffs);
	if(Math.abs(lwrY) < minY)
		return lwrY;
	else if(Math.abs(uprY) < minY)
		return uprY;
	else if(Math.sign(uprY) === Math.sign(lwrY))
	{
		console.log('no root, upry ' + uprY + ', lwry ' + lwrY);
		return false;
	}
	var midX;
	var midY;

	for(var i= 0; i < iterations; i += 1)
	{
		midX = (uprX + lwrX)/2;
		midY = getY(midX,coeffs);
		//console.log(i + ', ' + midX + ', ' + midY);
		if(Math.abs(midY) < 0.000000001)
			return midX;
		else if(Math.sign(midY) === Math.sign(lwrY))
		{
			lwrX = midX;
			lwrY = midY;
		}
		else
		{
			uprX = midX;
			uprY = midY;
		}
	}
}
