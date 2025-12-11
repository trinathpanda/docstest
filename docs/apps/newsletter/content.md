## Zcash Shielded Newsletter Tool

The Zcash Newsletter application allows organizations or individuals to send private (“shielded”) broadcast messages to many recipients in a single `z_sendmany` operation.

---

### How It Works

1. Enter the shielded or unified address you want to send from.
2. Set the default ZEC amount to send to each recipient.
3. Add one or more recipients:
   - Recipient Zcash address  
   - Optional custom memo (up to 504 characters per recipient)  
   - Optional custom amount per recipient
4. Click **Send via z_sendmany**.
5. The app submits a single `z_sendmany` request to your local Zcash node and waits for the operation result.

When the transaction completes, the sending status panel will display success or failure along with the resulting TXID if available.

---

### Technical Notes

- All transactions are generated through the official Zcash RPC method: `z_sendmany`.
- Custom memos are UTF-8 encoded, truncated or padded to the Zcash memo limit (512 bytes).
- Transfers remain shielded when valid shielded or unified addresses are used.
- A single RPC call is used per newsletter send.

---

### Operational Limits

The maximum number of recipients per send is not fixed by the Zcash protocol, but is restricted by practical constraints:

- **Transaction size limits** — large batches may exceed block limits.
- **Node memory & validation time** — large sends may stall or fail.
- **Available funds** — total ZEC required includes all recipient amounts and network fees.

#### Recommendation

For reliability, limit each newsletter batch to: **100–300 recipients per transaction**

For larger distributions, split your content into multiple sends.

---

### Funds Requirement

Your sending address must cover: **Total Required = (sum of all recipient amounts) + transaction fee**

Typical failure occurs when funds are insufficient: **Insufficient funds: have X, need Y**

---

### Troubleshooting

- **No recipients listed**  
  At least one valid address must be entered.

- **Invalid address error**  
  Only valid shielded (`zs…`) or unified (`u…`) addresses are accepted.

- **Operation timeout**  
  Large batches may take more than 90 seconds to finalize.

  Manual status check: zcash-cli z_getoperationstatus

- **Funds errors**  
  Ensure your sending address holds enough ZEC to cover total output + fee.

---

### Additional Zcash References

- Official Zcash Documentation: https://docs.zcash.me

- `z_sendmany` RPC Documentation: https://zcash.readthedocs.io/en/latest/rtd_pages/z_sendmany.html

- Zcash Core GitHub Repository: https://github.com/zcash/zcash

---

### About This Tool

This newsletter sender is designed as a lightweight operational solution for:

- Community announcements  
- Coordination campaigns  
- Resource distribution

All message delivery is handled using Zcash’s built-in privacy features.

## Concepts

1.  Preliminaries

---

## User Documentation

1.  Creating profiles
2.  Verifying profiles
3.  Editing Profile
4.  Verifying Links
5.  Integration into an existing platforms

---

## Design

1.  Directory
2.  Profile
3.  Feedback
    - Draft
    - Verify

## Release Notes