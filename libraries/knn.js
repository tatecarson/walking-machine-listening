const kNear = function(k, data) {
  // PRIVATE
  let training = [];
  if (typeof data !== 'undefined') {
    training = JSON.parse(data) || [];
  }
  console.log('data at kNear: ', training);
  const dist = function(v1, v2) {
    let sum = 0;
    v1.forEach(function(val, index) {
      sum += Math.pow(val - v2[index], 2); //eslint-disable-line
    });
    return Math.sqrt(sum);
  };

  const updateMax = function(val, arr) {
    let max = 0;
    arr.forEach(function(obj) {
      max = Math.max(max, obj.d);
    });
    return max;
  };

  function mode(store) {
    const frequency = {}; // array of frequency.
    let max = 0; // holds the max frequency.
    let result; // holds the max frequency element.
    for (const v in store) { //eslint-disable-line
      frequency[store[v]] = (frequency[store[v]] || 0) + 1; // increment frequency.
      if (frequency[store[v]] > max) {
        // is this frequency > max so far ?
        max = frequency[store[v]]; // update max.
        result = store[v]; // update result.
      }
    }
    return result;
  }

  // PUBLIC
  this.db = function() {
    return training;
  };

  // add a point to the training set
  this.learn = function(vector, label) {
    const obj = {
      v: vector,
      lab: label,
    };

    training.push(obj);
    console.log('training at learn: ', training);
  };

  this.classify = function(v) {
    const voteBloc = [];
    let maxD = 0;
    training.forEach(function(obj) {
      const o = {
        d: dist(v, obj.v),
        vote: obj.lab,
      };
      if (voteBloc.length < k) {
        voteBloc.push(o);
        maxD = updateMax(maxD, voteBloc);
      } else {
        if (o.d < maxD) { //eslint-disable-line
          let bool = true;
          let count = 0;
          while (bool) {
            if (Number(voteBloc[count].d) === maxD) {
              voteBloc.splice(count, 1, o);
              maxD = updateMax(maxD, voteBloc);
              bool = false;
            } else {
              if (count < voteBloc.length - 1) { //eslint-disable-line
                count++;
              } else {
                bool = false;
              }
            }
          }
        }
      }
    });
    const votes = [];
    voteBloc.forEach(function(el) {
      votes.push(el.vote);
    });
    return mode(votes);
  };
};
